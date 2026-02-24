import React, { useState, useRef, useEffect } from 'react';
import { AppState, Template, Product, OrderDetails, ShippingInfo } from './types';
import {
  Header, HomeView, TemplateSelection, PhotoUploadView,
  GeneratingView, ProductPreviewView, CheckoutView, SuccessView, CustomChatView, PaymentFailedView
} from './components/Views';

const MOCK_PAYMENT_MODE = false; // Set to true to bypass iPay88 for local testing

// --- Utility Functions ---
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const SHIPPING_COST = 0.00; // TODO: restore to 5.00 after testing

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppState>('HOME');
  const [order, setOrder] = useState<OrderDetails>({
    template: null,
    product: null,
    userPhoto: null,
    generatedImage: null,
    totalPrice: 0
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [aiState, setAiState] = useState<string>('Generating your magic...');

  const [isLoading, setIsLoading] = useState(false);

  // Persist credits
  const [credits, setCredits] = useLocalStorage<number>('printmagic_credits', 3);

  const creditsRef = useRef(credits);
  useEffect(() => {
    creditsRef.current = credits;
  }, [credits]);

  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postcode: ''
  });
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Detect iPay88 redirect back (payment=success or payment=failed in URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');
    if (paymentStatus === 'success') {
      setOrderPlaced(true);
      setCurrentStep('SUCCESS');
      // Clean URL
      window.history.replaceState({}, '', '/');
    } else if (paymentStatus === 'failed') {
      const err = params.get('err') || 'Payment was not completed. Please try again.';
      setPaymentError(err);
      setCurrentStep('PAYMENT_FAILED');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  // Sync browser URL with app state so iPay88 sees the registered Request URL
  useEffect(() => {
    if (currentStep === 'CHECKOUT') {
      window.history.replaceState({}, '', '/checkout');
    } else if (window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
    }
  }, [currentStep]);

  const resetFlow = () => {
    setOrder({
      template: null,
      userPhoto: null,
      generatedImage: null,
      product: null,
      totalPrice: 0
    });
    setCurrentStep('HOME');
    setError(null);
    setOrderPlaced(false);
    setShippingInfo({
      name: '', email: '', phone: '', address: '', city: '', state: '', postcode: ''
    });
    setUploadedImage(null);
    setSelectedTemplate(null);
    setAiState('Generating your magic...');
  };

  const handleTemplateSelect = (template: Template | null) => {
    if (template) {
      setSelectedTemplate(template);
      if (uploadedImage) {
        generateImage(template.prompt, false);
      } else {
        setOrder(prev => ({ ...prev, template }));
        setCurrentStep('UPLOAD_PHOTO');
      }
    } else {
      setCurrentStep('CUSTOM_CHAT');
    }
  };

  const handleCustomGenerate = async (customUserPrompt: string) => {
    if (credits <= 0) {
      setError("Out of credits! Purchase more to continue.");
      return;
    }

    if (!uploadedImage) {
      setError("Please upload a photo first.");
      setCurrentStep('UPLOAD_PHOTO');
      return;
    }

    try {
      setCurrentStep('GENERATING');
      setIsLoading(true);
      setAiState('Consulting the Spellbook...');

      // Step 1: Send short prompt to AI Prompt Optimizer
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawPrompt: customUserPrompt })
      });

      if (!response.ok) throw new Error('Failed to create custom prompt');

      const data = await response.json();

      // Step 2: Use the highly-detailed optimized prompt to trigger image generation
      await generateImage(data.optimizedPrompt, true);

    } catch (err) {
      console.error(err);
      setError("Failed to create magic prompt. Please try again.");
      setCurrentStep('CUSTOM_CHAT');
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const base64 = await fileToBase64(file);
      setUploadedImage(base64);
      setOrder(prev => ({ ...prev, userPhoto: base64 }));

      if (selectedTemplate) {
        generateImage(selectedTemplate.prompt, false);
      } else {
        setCurrentStep('SELECT_TEMPLATE');
      }
    } catch (err) {
      setError("Failed to process image.");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const generateImage = async (promptText: string, isCustomMode: boolean = false) => {
    if (creditsRef.current <= 0) {
      setError("Out of credits! Purchase more to continue.");
      setIsLoading(false);
      return;
    }

    if (!uploadedImage) {
      setError("Please upload a photo first.");
      setCurrentStep('UPLOAD_PHOTO');
      return;
    }

    setCurrentStep('GENERATING');
    setIsLoading(true);
    setAiState('Generating your magic...');

    try {
      // Secure local proxy call
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photo: uploadedImage,
          prompt: promptText,
          isCustomMode: isCustomMode
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate image from server.");
      }

      const data = await response.json();

      if (data.imageUrl) {
        setOrder(prev => ({ ...prev, generatedImage: data.imageUrl, template: selectedTemplate }));
        setCredits(prev => prev - 1);
        setCurrentStep('PREVIEW_PRODUCT');
      } else {
        throw new Error(data.error || "No image generated.");
      }
    } catch (err) {
      console.error(err);
      setError("AI generation failed. Please try again.");
      setCurrentStep(isCustomMode ? 'CUSTOM_CHAT' : 'SELECT_TEMPLATE');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    const price = product.price + SHIPPING_COST;
    setOrder(prev => ({ ...prev, product, totalPrice: price }));
    setCurrentStep('CHECKOUT');
  };

  const handlePlaceOrder = async () => {
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.city || !shippingInfo.state || !shippingInfo.postcode) {
      setError("Please fill out all shipping fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (MOCK_PAYMENT_MODE) {
        // Mock payment: simulate a 2-second processing delay then go to success
        await new Promise(resolve => setTimeout(resolve, 2000));
        setOrderPlaced(true);
        setCurrentStep('SUCCESS');
      } else {
        // --- Real iPay88 flow ---
        const orderId = `PM${Date.now()}`;
        const response = await fetch('/api/ipay88-initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: order.totalPrice.toString(),
            currency: 'MYR',
            prodDesc: `${order.product?.name || 'PrintMagic AI Merch'} — ${order.template?.name || 'Custom Design'}`,
            userName: shippingInfo.name,
            userEmail: shippingInfo.email,
            userContact: shippingInfo.phone,
            remark: `Ship to: ${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.postcode}`
          })
        });

        if (!response.ok) throw new Error('Failed to initiate payment');

        const { payload, paymentUrl } = await response.json();

        // Create a hidden form and auto-submit to iPay88
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = paymentUrl;
        form.style.display = 'none';

        for (const [key, value] of Object.entries(payload)) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value as string;
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit(); // Redirect to iPay88 payment page
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (uploadedImage && selectedTemplate) {
      generateImage(selectedTemplate.prompt, false);
    } else if (uploadedImage && currentStep === 'CUSTOM_CHAT') {
      // If in custom chat, user needs to re-enter prompt or go back
      setError("Please enter a custom prompt to regenerate.");
      setCurrentStep('CUSTOM_CHAT');
    } else {
      setCurrentStep('UPLOAD_PHOTO');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-purple-200 selection:text-purple-900">
      <Header resetFlow={resetFlow} credits={credits} setCredits={setCredits} orderPlaced={orderPlaced} />

      <main className="pb-20">
        {currentStep === 'HOME' && <HomeView onStart={() => setCurrentStep('UPLOAD_PHOTO')} />}
        {currentStep === 'UPLOAD_PHOTO' && <PhotoUploadView onBack={() => setCurrentStep('HOME')} onUpload={handlePhotoUpload} error={error} isLoading={isLoading} />}
        {currentStep === 'SELECT_TEMPLATE' && (
          <TemplateSelection onSelect={handleTemplateSelect} onBack={() => setCurrentStep('UPLOAD_PHOTO')} />
        )}

        {currentStep === 'CUSTOM_CHAT' && uploadedImage && (
          <CustomChatView
            uploadedImage={uploadedImage}
            onGenerate={handleCustomGenerate}
            onBack={() => setCurrentStep('SELECT_TEMPLATE')}
            error={error}
            isLoading={isLoading}
          />
        )}

        {currentStep === 'GENERATING' && <GeneratingView aiState={aiState} />}
        {currentStep === 'PREVIEW_PRODUCT' && <ProductPreviewView order={order} onRegenerate={handleRegenerate} onSelectProduct={handleProductSelect} />}
        {currentStep === 'CHECKOUT' && <CheckoutView order={order} shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} onPlaceOrder={handlePlaceOrder} onBack={() => setCurrentStep('PREVIEW_PRODUCT')} isLoading={isLoading} error={error} shippingCost={SHIPPING_COST} isMockMode={MOCK_PAYMENT_MODE} />}
        {currentStep === 'SUCCESS' && <SuccessView resetFlow={resetFlow} />}
        {currentStep === 'PAYMENT_FAILED' && <PaymentFailedView error={paymentError} onRetry={() => setCurrentStep('CHECKOUT')} resetFlow={resetFlow} />}
      </main>

      {/* Mobile Sticky CTA */}
      {currentStep === 'SELECT_TEMPLATE' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl p-5 border-t border-gray-100 md:hidden z-40 flex justify-center shadow-2xl">
          <p className="text-sm font-black text-purple-600 uppercase tracking-widest">Tap a style to start magic</p>
        </div>
      )}
    </div>
  );
}
