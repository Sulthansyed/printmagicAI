
export type TemplateCategory = 'Cartoon' | 'Movie' | 'Meme' | 'Portrait' | 'Caricature' | 'Fitness' | 'Royal' | 'Retro' | 'Space' | 'Kids' | 'Sci-Fi' | 'Artistic' | 'Abstract' | 'Fantasy';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  thumbnail: string;
  prompt: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  overlayConfig: {
    top: string;
    left: string;
    width: string;
    height: string;
    rotate?: string;
  };
}

export interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
}

export interface IPay88Payload {
  MerchantCode: string;
  PaymentId: string;
  RefNo: string;
  Amount: string;
  Currency: string;
  ProdDesc: string;
  UserName: string;
  UserEmail: string;
  UserContact: string;
  Remark: string;
  Lang: string;
  SignatureType: string;
  Signature: string;
  ResponseURL: string;
  BackendURL: string;
}

export type AppState = 'HOME' | 'UPLOAD_PHOTO' | 'SELECT_TEMPLATE' | 'CUSTOM_CHAT' | 'GENERATING' | 'PREVIEW_PRODUCT' | 'CHECKOUT' | 'SUCCESS';

export interface OrderDetails {
  template: Template | null;
  userPhoto: string | null;
  generatedImage: string | null;
  product: Product | null;
  totalPrice: number;
}
