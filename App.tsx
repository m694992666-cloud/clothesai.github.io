
import React, { useState, useEffect } from 'react';
import { AppView, FashionStyle, Product, TryOnState, UserProfile, Order, ProductCategory } from './types';
import { Navigation } from './components/Navigation';
import { ExploreView } from './views/ExploreView';
import { TryOnView } from './views/TryOnView';
import { ProfileView } from './views/ProfileView';
import { ProductDetailView } from './views/ProductDetailView';
import { MerchantDashboard } from './views/MerchantDashboard';

// Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', title: '极简羊绒大衣', price: 1299, tags: [FashionStyle.BUSINESS, FashionStyle.CASUAL], category: ProductCategory.OUTER, image: 'https://picsum.photos/300/400?random=1', description: '甄选顶级山羊绒，手感细腻软糯，经典H型剪裁，包容性极强。驼色系温柔显白，是秋冬衣橱的必备单品。', stock: 120, sales: 45, storeName: '摩登时代旗舰店', storeAddress: '上海市静安区南京西路1266号恒隆广场' },
  { id: '2', title: '丝绒晚礼服', price: 2599, tags: [FashionStyle.PARTY], category: ProductCategory.DRESS, image: 'https://picsum.photos/300/400?random=2', description: '法式复古丝绒面料，在光影下流转迷人光泽。深V领口设计展现迷人锁骨，高开叉裙摆行走间摇曳生姿。', stock: 15, sales: 8, storeName: 'Luxe Couture', storeAddress: '北京市朝阳区建国路87号SKP' },
  { id: '3', title: '复古运动夹克', price: 599, tags: [FashionStyle.SPORT], category: ProductCategory.OUTER, image: 'https://picsum.photos/300/400?random=3', stock: 200, sales: 89, storeName: 'Urban Sport', storeAddress: '广州市天河区天河路208号天河城' },
  { id: '4', title: '亚麻休闲衬衫', price: 399, tags: [FashionStyle.CASUAL], category: ProductCategory.TOP, image: 'https://picsum.photos/300/400?random=4', stock: 50, sales: 120, storeName: '无印良品风精选', storeAddress: '成都市锦江区中纱帽街8号太古里' },
  { id: '5', title: '高腰西装裤', price: 499, tags: [FashionStyle.BUSINESS], category: ProductCategory.BOTTOM, image: 'https://picsum.photos/300/400?random=5', stock: 80, sales: 67, storeName: '摩登时代旗舰店', storeAddress: '上海市静安区南京西路1266号恒隆广场' },
  { id: '6', title: '设计师联名卫衣', price: 899, tags: [FashionStyle.SPORT, FashionStyle.CASUAL], category: ProductCategory.TOP, image: 'https://picsum.photos/300/400?random=6', stock: 30, sales: 21, storeName: 'Urban Sport', storeAddress: '广州市天河区天河路208号天河城' },
];

const INITIAL_USER: UserProfile = {
  name: '时尚体验官',
  avatar: 'https://picsum.photos/200/200?random=99',
  isMerchant: false, 
  stats: { works: 24, likes: 1089, orders: 0 },
  bodyStats: { height: 165, weight: 52, bust: 86, waist: 64, hips: 90 }
};

// Phone Frame Component for split view
const PhoneFrame: React.FC<{ children: React.ReactNode; className?: string; label?: string }> = ({ children, className, label }) => {
  return (
    <div className="flex flex-col items-center gap-4">
      {label && <div className="text-gray-400 font-bold tracking-widest text-sm uppercase">{label}</div>}
      <div className={`relative w-full max-w-md h-[844px] shadow-2xl overflow-hidden border-[12px] border-gray-900 rounded-[3rem] bg-white ${className}`}>
        {children}
        {/* iOS Home Bar Indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full z-50 pointer-events-none"></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.EXPLORE);
  const [tryOnState, setTryOnState] = useState<TryOnState>(TryOnState.IDLE);
  const [currentStyle, setCurrentStyle] = useState<FashionStyle | null>(null);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  
  // Dynamic Background Logic
  const getBackgroundClass = () => {
    // Merchant View is clean white/gray
    if (currentView === AppView.MERCHANT) return 'bg-gray-50';

    // Priority 1: Processing State
    if (tryOnState === TryOnState.PROCESSING) return 'bg-[#F3E5F5]'; // Very light purple
    
    // Priority 2: Upload/Idle State in Try On View
    if (tryOnState === TryOnState.IDLE && currentView === AppView.TRY_ON) return 'bg-[#FAFAFA]';

    // Priority 3: Product Detail View (Context based on product style)
    if (currentView === AppView.PRODUCT_DETAIL && selectedProduct) {
       // If showing result in overlay, stick to product style
       const style = selectedProduct.tags[0];
       switch (style) {
        case FashionStyle.CASUAL: return 'bg-gradient-to-br from-[#FFF9C4] to-[#E8F5E9]';
        case FashionStyle.BUSINESS: return 'bg-gradient-to-br from-[#F5F5F5] to-[#E3F2FD]';
        case FashionStyle.PARTY: return 'bg-gradient-to-br from-[#311B92] via-[#512DA8] to-[#673AB7] text-white'; // Darker theme for party
        case FashionStyle.SPORT: return 'bg-gradient-to-br from-[#FFECB3] to-[#E8F5E9]';
        default: return 'bg-white';
      }
    }

    // Priority 4: Style Context (From Try-On or Explore Tabs)
    if (currentStyle) {
      switch (currentStyle) {
        case FashionStyle.CASUAL: return 'bg-gradient-to-br from-[#FFF9C4] to-[#E8F5E9]';
        case FashionStyle.BUSINESS: return 'bg-gradient-to-br from-[#ECEFF1] to-[#CFD8DC]'; // Cooler grey/blue
        case FashionStyle.PARTY: return 'bg-gradient-to-br from-[#4A148C] via-[#7B1FA2] to-[#AB47BC] text-white'; // Deep rich purple for party
        case FashionStyle.SPORT: return 'bg-gradient-to-br from-[#E0F2F1] to-[#80CBC4]'; // Energetic teal/green
        default: return 'bg-gradient-to-br from-[#E3F2FD] to-[#F3E5F5]';
      }
    }

    // Priority 5: Default Views
    return 'bg-gradient-to-br from-[#E3F2FD] to-[#F3E5F5]'; // Default Explore Blue-Purple
  };

  const [bgClass, setBgClass] = useState(getBackgroundClass());

  useEffect(() => {
    setBgClass(getBackgroundClass());
  }, [currentView, tryOnState, currentStyle, selectedProduct]);

  // Handlers
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView(AppView.PRODUCT_DETAIL);
    setTryOnState(TryOnState.IDLE); // Reset try-on state
  };

  const handleToggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      } else {
        return [product, ...prev];
      }
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => 
      prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
    // Sync with favorites if updated
    setFavorites(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    // Synchronize: Remove from favorites if it exists
    setFavorites(prev => prev.filter(p => p.id !== productId));
  };

  const handleCreateOrder = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o)
    );
  };

  const handleBecomeMerchant = () => {
    setUser({ ...user, isMerchant: true });
    setCurrentView(AppView.MERCHANT); // Redirect immediately
  };
  
  const handleCreateProduct = (newProductData: Partial<Product>) => {
    const newProduct: Product = {
      id: Date.now().toString(),
      title: newProductData.title || '新商品',
      price: newProductData.price || 0,
      image: newProductData.image || 'https://picsum.photos/300/400',
      tags: newProductData.tags || [FashionStyle.CASUAL],
      description: newProductData.description || '',
      stock: newProductData.stock || 0,
      sales: 0,
      storeName: user.name + '的店',
      ...newProductData
    };
    setProducts([newProduct, ...products]);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  // Content for User App
  const renderUserApp = () => (
    <div className={`h-full w-full relative transition-colors duration-700 ease-in-out ${bgClass} font-sans overflow-hidden`}>
      <main className="h-full w-full">
        {currentView === AppView.EXPLORE && (
          <div className="h-full overflow-y-auto no-scrollbar">
            <ExploreView 
              products={products} 
              onProductSelect={handleProductSelect}
              onStyleChange={setCurrentStyle}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}
        
        {currentView === AppView.PRODUCT_DETAIL && selectedProduct && (
          <ProductDetailView 
            product={selectedProduct}
            allProducts={products}
            user={user}
            onBack={() => {
              setCurrentView(AppView.EXPLORE);
              setCurrentStyle(null); // Reset style when going back to explore
            }}
            brandColor="#6A11CB"
            onStateChange={setTryOnState}
            onPlaceOrder={handleCreateOrder}
            onSelectProduct={handleProductSelect}
          />
        )}

        {currentView === AppView.TRY_ON && (
          <TryOnView 
            onStateChange={setTryOnState} 
            onStyleChange={setCurrentStyle} 
            brandColor="#6A11CB"
            user={user}
            onSaveWork={() => setUser(prev => ({ ...prev, stats: { ...prev.stats, works: prev.stats.works + 1 }}))}
          />
        )}
        
        {currentView === AppView.PROFILE && (
          <div className="h-full overflow-y-auto no-scrollbar">
             <ProfileView 
              user={{...user, stats: {...user.stats, orders: orders.length}}} 
              orders={orders}
              favorites={favorites}
              onNavigate={setCurrentView}
              onBecomeMerchant={handleBecomeMerchant}
              onUpdateUser={handleUpdateUser}
              onSelectProduct={handleProductSelect}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        )}

        {currentView === AppView.MERCHANT && (
           <MerchantDashboard 
              products={products}
              orders={orders}
              onBackToApp={() => setCurrentView(AppView.PROFILE)}
              onUpdateProduct={handleUpdateProduct}
              onCreateProduct={handleCreateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrder={handleUpdateOrder}
           />
        )}
      </main>

      {/* Navigation */}
      {currentView !== AppView.PRODUCT_DETAIL && currentView !== AppView.MERCHANT && (
        <Navigation 
          currentView={currentView} 
          onNavigate={(view) => {
            setCurrentView(view);
            if (view === AppView.TRY_ON) {
               setTryOnState(TryOnState.SELECTING);
            } else {
              setTryOnState(TryOnState.IDLE);
              setCurrentStyle(null);
            }
          }}
          brandColor="#6A11CB"
        />
      )}
    </div>
  );

  return (
    <>
      {/* Mobile View (Default) */}
      <div className="lg:hidden h-screen w-full">
        {renderUserApp()}
      </div>

      {/* Desktop/Tablet Split View (Dual Fitting Room Architecture Demo) */}
      <div className="hidden lg:flex min-h-screen bg-gray-100 items-center justify-center gap-12 p-8 overflow-x-auto">
         
         {/* Left: User App */}
         <PhoneFrame className="" label="User App (Client)">
            {renderUserApp()}
         </PhoneFrame>

         {/* Right: Merchant App */}
         <PhoneFrame className="bg-gray-50" label="Merchant Dashboard (Admin)">
            <MerchantDashboard 
              products={products}
              orders={orders}
              onBackToApp={() => {}} // Disabled in split view
              isStandalone={true}
              onUpdateProduct={handleUpdateProduct}
              onCreateProduct={handleCreateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrder={handleUpdateOrder}
            />
         </PhoneFrame>

      </div>
    </>
  );
};

export default App;
