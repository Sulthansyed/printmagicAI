import React, { useState } from 'react';
import { Upload, Camera, Sparkles, Image as ImageIcon, ChevronRight, Edit3, ShoppingCart, ArrowRight, CheckCircle2, ShieldCheck, Truck, Wand2, ArrowLeft, Info, RefreshCw, ShoppingBag, Lock } from 'lucide-react';
import { AppState, Template, Product, OrderDetails, ShippingInfo } from '../types';
import { TEMPLATES, PRODUCTS } from '../constants';

export const Header = ({ resetFlow, credits, setCredits, orderPlaced }: { resetFlow: () => void; credits: number; setCredits: (c: number) => void; orderPlaced: boolean }) => {
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={resetFlow}>
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white font-black text-xl italic">P</div>
                <span className="text-xl font-bold tracking-tight text-gray-900">PrintMagic AI</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="bg-purple-50 px-3 py-1 rounded-full text-purple-700 text-sm font-semibold border border-purple-100 shadow-sm">
                        {credits} Credits
                    </div>
                    {/* Show DEV button always during testing — remove when going live */}
                    {true && (
                        <button
                            onClick={() => setCredits(99)}
                            className="text-[10px] bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded-md font-black uppercase tracking-widest transition-colors shadow-sm active:scale-95"
                            title="Dev Mode: Reset Credits"
                        >
                            +DEV
                        </button>
                    )}
                </div>
                <div className="relative group ml-2">
                    <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-purple-600 transition-colors" />
                    {orderPlaced && (
                        <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
                    )}
                </div>
            </div>
        </header>
    );
};

export const CustomChatView = ({
    uploadedImage,
    onGenerate,
    onBack,
    error,
    isLoading
}: {
    uploadedImage: string;
    onGenerate: (prompt: string) => void;
    onBack: () => void;
    error?: string | null;
    isLoading?: boolean;
}) => {
    const [prompt, setPrompt] = useState('');

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Templates
            </button>

            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 space-y-4">
                    <h3 className="font-semibold text-gray-900">Your Photo</h3>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 ring-1 ring-gray-200">
                        <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="w-full md:w-2/3 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                            <Wand2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">Custom Prompt</h2>
                            <p className="text-sm text-gray-500">Describe exactly what you want to become.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center">
                                <Info className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        )}

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g. A heroic Jedi knight holding a glowing blue lightsaber, fighting a massive red dragon inside a dark volcano. Cinematic lighting."
                            className="w-full min-h-[160px] p-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all overflow-hidden resize-none placeholder-gray-400 text-gray-700 font-medium"
                        />

                        <button
                            onClick={() => onGenerate(prompt)}
                            disabled={prompt.trim().length < 5 || isLoading}
                            className="w-full flex items-center justify-center py-4 bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all hover:shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                                    Working Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-3" />
                                    Generate Magic Idea
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const HomeView = ({ onStart }: { onStart: () => void }) => (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        <div className="text-center mb-20 space-y-6">
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[1.1] tracking-tight">
                Your Face. <br />
                <span className="text-transparent bg-clip-text gradient-bg py-2 inline-block">Any Universe.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                Choose a template, upload a selfie, and see yourself as a superhero, movie star, or meme. Order your creation on premium merch!
            </p>
            <button
                onClick={onStart}
                className="mt-4 px-10 py-5 gradient-bg text-white rounded-2xl font-bold text-xl shadow-2xl shadow-purple-300 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mx-auto"
            >
                Get Started <ArrowRight className="w-6 h-6" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
            {TEMPLATES.slice(0, 3).map(t => (
                <div key={t.id} className="group relative w-full max-w-[340px] aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-white shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500">
                    <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                        <span className="text-purple-400 text-sm font-bold uppercase tracking-widest mb-1">{t.category}</span>
                        <h3 className="text-white text-2xl font-black">{t.name}</h3>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export const TemplateSelection = ({ onBack, onSelect }: { onBack: () => void; onSelect: (t: Template | null) => void }) => (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
            <div>
                <h2 className="text-4xl font-black text-gray-900">Select a Style</h2>
                <p className="text-gray-500 font-medium">Browse our exclusive library of AI templates.</p>
            </div>
            <button onClick={onBack} className="w-fit text-gray-500 font-semibold flex items-center gap-2 hover:text-black transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Custom Chat Card */}
            <div
                onClick={() => onSelect(null)}
                className="group relative rounded-[2rem] overflow-hidden cursor-pointer aspect-[4/5] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                <div className="w-full h-full bg-gray-900 rounded-[1.5rem] flex flex-col items-center justify-center p-6 text-center relative z-20">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">Custom Magic</h3>
                    <p className="text-sm text-purple-200">Describe exactly what you want</p>
                </div>
            </div>

            {TEMPLATES.map(t => (
                <button
                    key={t.id}
                    onClick={() => onSelect(t)}
                    className="group text-left space-y-4 bg-white p-3 rounded-[2rem] border border-gray-100 hover:border-purple-500 hover:shadow-2xl transition-all shadow-sm"
                >
                    <div className="aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-gray-100 relative">
                        <img src={t.thumbnail} alt={t.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        {t.price > 0 && (
                            <div className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-lg">
                                Premium
                            </div>
                        )}
                    </div>
                    <div className="px-3 pb-2 flex flex-col justify-between h-[80px]">
                        <div>
                            <span className="text-purple-600 text-[10px] font-black uppercase tracking-widest block mb-1">{t.category}</span>
                            <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-tight">{t.name}</h4>
                        </div>
                        <p className="text-xs text-gray-400 font-medium line-clamp-1">{t.description}</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

export const PhotoUploadView = ({ onBack, onUpload, error, isLoading }: { onBack: () => void; onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void; error: string | null; isLoading: boolean }) => (
    <div className="max-w-xl mx-auto px-6 py-12">
        <button onClick={onBack} className="mb-6 text-gray-500 font-semibold flex items-center gap-2 hover:text-black group transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Styles
        </button>
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 text-center space-y-8">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                <Camera className="w-12 h-12" />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-gray-900">Upload Your Photo</h2>
                <p className="text-gray-500 font-medium">The magic starts with a great selfie.</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 text-left items-start">
                <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-blue-900 font-bold text-sm">Recommended for best results:</p>
                    <ul className="text-blue-800 text-xs space-y-1 list-disc list-inside opacity-90">
                        <li>Use a high-resolution portrait or selfie</li>
                        <li>Ensure your face is well-lit and clearly visible</li>
                        <li>Avoid heavy filters or blurry images</li>
                    </ul>
                </div>
            </div>

            <label className="block w-full">
                <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
                <div className="w-full py-16 border-2 border-dashed border-gray-200 rounded-3xl hover:border-purple-400 hover:bg-purple-50/50 cursor-pointer transition-all flex flex-col items-center gap-4 group">
                    <Upload className="w-10 h-10 text-gray-300 group-hover:text-purple-400 transition-colors" />
                    <div className="space-y-1">
                        <span className="text-lg font-bold text-gray-900 block">{isLoading ? 'Processing Photo...' : 'Click to select file'}</span>
                        <span className="text-sm font-medium text-gray-400">PNG, JPG up to 10MB</span>
                    </div>
                </div>
            </label>

            {error && <p className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">{error}</p>}
        </div>
    </div>
);

export const GeneratingView = () => (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 space-y-8">
        <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-gray-100 border-t-purple-600 animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-purple-600 animate-pulse" />
        </div>
        <div className="text-center space-y-4">
            <h2 className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text gradient-bg uppercase">Magic in progress</h2>
            <div className="flex flex-col gap-2">
                <p className="text-gray-500 font-bold animate-bounce text-lg">Applying AI brushstrokes...</p>
                <p className="text-gray-400 text-sm italic">This usually takes about 10-15 seconds</p>
            </div>
        </div>
    </div>
);

export const ProductPreviewView = ({ order, onRegenerate, onSelectProduct }: { order: OrderDetails; onRegenerate: () => void; onSelectProduct: (p: Product) => void }) => (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-6 shadow-2xl border border-gray-100">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-2 text-gray-900">
                        <Sparkles className="w-6 h-6 text-yellow-500" /> Your AI Masterpiece
                    </h3>
                    <div className="relative rounded-[2rem] overflow-hidden shadow-inner group bg-gray-50 border border-gray-100">
                        <img src={order.generatedImage!} className="w-full aspect-square object-cover" />

                        {/* Anti-Freeloader Watermark */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-around opacity-30 mix-blend-overlay select-none">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex gap-8 -rotate-12 translate-x-[-10%] w-[150%]">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <h1 key={j} className="text-4xl md:text-6xl font-black text-white whitespace-nowrap drop-shadow-lg">PrintMagic AI</h1>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button onClick={() => window.open(order.generatedImage!, '_blank')} className="bg-white text-black px-6 py-3 rounded-full font-bold shadow-xl">Full View</button>
                        </div>
                    </div>
                    <div className="mt-8 flex gap-4">
                        <button onClick={onRegenerate} className="flex-1 py-4 px-6 bg-gray-100 hover:bg-gray-200 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                            <RefreshCw className="w-5 h-5 text-gray-600" /> Regenerate
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-10">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2">Merchandise</h2>
                    <p className="text-xl text-gray-500 font-medium">Select a product to print your design.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {PRODUCTS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => onSelectProduct(p)}
                            className="group bg-white p-4 rounded-[2rem] border border-gray-100 hover:border-purple-500 hover:shadow-2xl transition-all text-left flex flex-col"
                        >
                            <div className="aspect-square bg-gray-50 rounded-[1.5rem] mb-4 overflow-hidden relative shadow-inner">
                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div
                                    className="absolute shadow-lg border-2 border-white/20"
                                    style={{
                                        top: p.overlayConfig.top,
                                        left: p.overlayConfig.left,
                                        width: p.overlayConfig.width,
                                        height: p.overlayConfig.height,
                                        transform: p.overlayConfig.rotate ? `rotate(${p.overlayConfig.rotate})` : 'none',
                                    }}
                                >
                                    <img src={order.generatedImage!} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <h4 className="font-black text-gray-900 text-lg group-hover:text-purple-700 transition-colors">{p.name}</h4>
                                <p className="text-purple-600 font-black text-xl mt-1">RM {p.price.toFixed(2)}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export const CheckoutView = ({
    order, shippingInfo, setShippingInfo, onPlaceOrder, onBack, isLoading, error, shippingCost, isMockMode
}: {
    order: OrderDetails;
    shippingInfo: ShippingInfo;
    setShippingInfo: React.Dispatch<React.SetStateAction<ShippingInfo>>;
    onPlaceOrder: () => void;
    onBack: () => void;
    isLoading: boolean;
    error: string | null;
    shippingCost: number;
    isMockMode?: boolean;
}) => (
    <div className="max-w-5xl mx-auto px-6 py-12">
        <button onClick={onBack} className="mb-6 text-gray-500 font-semibold flex items-center gap-2 hover:text-black group transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Products
        </button>
        {/* Payment Mode Banner */}
        {isMockMode && (
            <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-5 py-3 rounded-2xl text-sm font-semibold">
                <span className="bg-amber-400 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">Mock Mode</span>
                Payment gateway not yet configured. Checkout will simulate a successful order.
            </div>
        )}
        <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
                <h2 className="text-4xl font-black text-gray-900">Review Order</h2>
                <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 space-y-8">
                    <div className="flex gap-6 items-center">
                        <div className="w-32 h-32 bg-gray-50 rounded-3xl relative overflow-hidden shrink-0 border border-gray-100 shadow-inner">
                            <img src={order.product!.image} className="w-full h-full object-cover" />
                            <div
                                className="absolute"
                                style={{
                                    top: order.product!.overlayConfig.top,
                                    left: order.product!.overlayConfig.left,
                                    width: order.product!.overlayConfig.width,
                                    height: order.product!.overlayConfig.height,
                                    transform: order.product!.overlayConfig.rotate ? `rotate(${order.product!.overlayConfig.rotate})` : 'none',
                                }}
                            >
                                <img src={order.generatedImage!} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-purple-600 font-black text-xs uppercase tracking-widest">{order.template?.category || 'Custom Magic'}</span>
                            <h3 className="font-black text-2xl text-gray-900">{order.product!.name}</h3>
                            <p className="text-gray-500 font-medium">Art Style: {order.template?.name || 'Your unique prompt'}</p>
                        </div>
                    </div>

                    <div className="border-t pt-8 space-y-4">
                        <div className="flex justify-between text-gray-600 font-medium">
                            <span>Merchandise</span>
                            <span>RM {order.product!.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 font-medium">
                            <span>Shipping</span>
                            <span>RM {shippingCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-black text-2xl text-gray-900 pt-6 border-t">
                            <span>Total Amount</span>
                            <span className="text-transparent bg-clip-text gradient-bg">RM {order.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-4xl font-black text-gray-900">Shipping Info</h2>
                <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-600 uppercase tracking-widest">Full Name</label>
                            <input type="text" placeholder="John Doe" value={shippingInfo.name} onChange={e => setShippingInfo(prev => ({ ...prev, name: e.target.value }))} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-600 uppercase tracking-widest">Phone Number</label>
                            <input type="tel" placeholder="+60 12-345 6789" value={shippingInfo.phone} onChange={e => setShippingInfo(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 transition-all" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-600 uppercase tracking-widest">Email Address</label>
                        <input type="email" placeholder="john@example.com" value={shippingInfo.email} onChange={e => setShippingInfo(prev => ({ ...prev, email: e.target.value }))} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 transition-all" />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-black text-gray-600 uppercase tracking-widest">Delivery Address</label>
                        <textarea placeholder="No 123, Jalan AI Magic..." value={shippingInfo.address} onChange={e => setShippingInfo(prev => ({ ...prev, address: e.target.value }))} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 transition-all" rows={3}></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-600 uppercase tracking-widest">City</label>
                            <input type="text" placeholder="Kuala Lumpur" value={shippingInfo.city} onChange={e => setShippingInfo(prev => ({ ...prev, city: e.target.value }))} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-600 uppercase tracking-widest">State</label>
                            <input type="text" placeholder="WP Kuala Lumpur" value={shippingInfo.state} onChange={e => setShippingInfo(prev => ({ ...prev, state: e.target.value }))} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 transition-all" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black text-gray-600 uppercase tracking-widest">Postcode</label>
                            <input type="text" placeholder="50000" value={shippingInfo.postcode} onChange={e => setShippingInfo(prev => ({ ...prev, postcode: e.target.value }))} className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium text-gray-900 transition-all" />
                        </div>
                    </div>

                    {error && <p className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">{error}</p>}
                    <button
                        onClick={onPlaceOrder}
                        disabled={isLoading}
                        className="w-full py-5 gradient-bg text-white rounded-[1.5rem] font-black text-xl shadow-2xl shadow-purple-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-6 h-6 animate-spin" />
                        ) : isMockMode ? (
                            <>Confirm Mock Order <ArrowRight className="w-6 h-6" /></>
                        ) : (
                            <><Lock className="w-5 h-5" /> Pay Now — RM {order.totalPrice.toFixed(2)}</>
                        )}
                    </button>
                    <div className="flex items-center justify-center gap-6 pt-4">
                        <div className="font-black text-gray-500 text-xs flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-lg">
                            <Lock className="w-3 h-3" /> Secured by iPay88
                        </div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-40" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 opacity-40" alt="Mastercard" />
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const SuccessView = ({ resetFlow }: { resetFlow: () => void }) => (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-10">
        <div className="w-32 h-32 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto animate-bounce shadow-xl shadow-green-100">
            <CheckCircle2 className="w-16 h-16" />
        </div>
        <div className="space-y-4">
            <h2 className="text-5xl font-black text-gray-900 italic tracking-tight uppercase">Payment Confirmed!</h2>
            <p className="text-xl text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">Your custom masterpiece is being hand-crafted. We'll send a tracking link to your email as soon as it ships!</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <button onClick={resetFlow} className="px-10 py-5 gradient-bg text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-200 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                <ShoppingBag className="w-6 h-6" /> Create More Magic
            </button>
            <button onClick={() => window.print()} className="px-10 py-5 bg-white text-gray-700 border border-gray-200 rounded-2xl font-black text-lg shadow-sm hover:bg-gray-50 transition-colors">
                Download Receipt
            </button>
        </div>
    </div>
);

export const PaymentFailedView = ({ error, onRetry, resetFlow }: { error: string | null; onRetry: () => void; resetFlow: () => void }) => (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center space-y-10">
        <div className="w-32 h-32 bg-red-100 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-red-100">
            <Info className="w-16 h-16" />
        </div>
        <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Payment Not Completed</h2>
            <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
                {error || 'Your payment was not completed. No charges were made.'}
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
            <button onClick={onRetry} className="px-10 py-5 gradient-bg text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-200 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all">
                <RefreshCw className="w-5 h-5" /> Try Again
            </button>
            <button onClick={resetFlow} className="px-10 py-5 bg-white text-gray-700 border border-gray-200 rounded-2xl font-black text-lg shadow-sm hover:bg-gray-50 transition-colors">
                Start Over
            </button>
        </div>
    </div>
);
