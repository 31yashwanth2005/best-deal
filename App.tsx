
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2,
  PackageSearch,
  ExternalLink
} from 'lucide-react';
import { Product, PurchaseDecision, BudgetAlert, PlatformPrice } from './types';
import PriceChart from './components/PriceChart';
import DecisionBadge from './components/DecisionBadge';
import { analyzePriceData } from './services/geminiService';

const AVAILABLE_PLATFORMS = [
  'Amazon India',
  'Flipkart',
  'Reliance Digital',
  'Croma',
  'Tata CLiQ',
  'JioMart',
  'Vijay Sales',
  'Poorvika',
  'Sangeetha Mobiles',
  'Myntra'
];

// Mock Initial Data (Prices adjusted to more realistic Rupee values)
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sony WH-1000XM5 Noise Cancelling Headphones',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1618366712277-707049d1988f?q=80&w=400&h=300&auto=format&fit=crop',
    currentPrice: 29990.00,
    platforms: [
      { platform: 'Amazon India', price: 29990.00, url: '#', availability: true },
      { platform: 'Flipkart', price: 30499.00, url: '#', availability: true },
      { platform: 'Reliance Digital', price: 29999.00, url: '#', availability: true },
      { platform: 'Croma', price: 29490.00, url: '#', availability: true },
      { platform: 'Tata CLiQ', price: 30100.00, url: '#', availability: true }
    ],
    historicalPrices: [
      { date: 'Jan 1', price: 34990.00 },
      { date: 'Jan 8', price: 32990.00 },
      { date: 'Jan 15', price: 31990.00 },
      { date: 'Jan 22', price: 30990.00 },
      { date: 'Jan 29', price: 29990.00 }
    ]
  },
  {
    id: '2',
    name: 'NVIDIA GeForce RTX 4080 Super',
    category: 'PC Hardware',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=400&h=300&auto=format&fit=crop',
    currentPrice: 105000.00,
    platforms: [
      { platform: 'MDComputers', price: 105000.00, url: '#', availability: true },
      { platform: 'Vedant Computers', price: 107500.00, url: '#', availability: true },
      { platform: 'PrimeABGB', price: 104500.00, url: '#', availability: true },
      { platform: 'Amazon India', price: 109990.00, url: '#', availability: true }
    ],
    historicalPrices: [
      { date: 'Jan 1', price: 95000.00 },
      { date: 'Jan 8', price: 97500.00 },
      { date: 'Jan 15', price: 99990.00 },
      { date: 'Jan 22', price: 102500.00 },
      { date: 'Jan 29', price: 105000.00 }
    ]
  }
];

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId), 
  [products, selectedProductId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    // Simulate finding a new product with Rupee-scaled pricing
    const basePrice = Math.floor(Math.random() * 50000) + 5000;
    
    // Randomly select 4-6 unique platforms for the new search result
    const shuffledPlatforms = [...AVAILABLE_PLATFORMS].sort(() => 0.5 - Math.random());
    const selectedPlatforms: PlatformPrice[] = shuffledPlatforms.slice(0, 4 + Math.floor(Math.random() * 3)).map(name => ({
      platform: name,
      price: basePrice + (Math.random() * basePrice * 0.1 - (basePrice * 0.05)),
      url: '#',
      availability: Math.random() > 0.1
    }));

    // Find the minimum price among selected platforms to be the "current price"
    const currentPrice = Math.min(...selectedPlatforms.map(p => p.price));

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: searchTerm,
      category: 'Search Result',
      image: `https://picsum.photos/seed/${searchTerm}/400/300`,
      currentPrice: currentPrice,
      platforms: selectedPlatforms,
      historicalPrices: Array.from({ length: 6 }).map((_, i) => ({
        date: `Feb ${i + 1}`,
        price: basePrice * (0.85 + Math.random() * 0.3)
      }))
    };
    
    setProducts(prev => [newProduct, ...prev]);
    setSelectedProductId(newProduct.id);
    setSearchTerm('');
  };

  const runDeepAnalysis = async (product: Product) => {
    if (product.analysis) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzePriceData(product.name, product.currentPrice, product.historicalPrices);
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, analysis: result } : p
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (selectedProduct && !selectedProduct.analysis) {
      runDeepAnalysis(selectedProduct);
    }
  }, [selectedProductId]);

  const addAlert = (product: Product) => {
    const target = product.currentPrice * 0.9;
    const newAlert: BudgetAlert = {
      id: Math.random().toString(),
      productId: product.id,
      productName: product.name,
      targetPrice: target,
      createdAt: new Date().toLocaleDateString()
    };
    setAlerts(prev => [newAlert, ...prev]);
    setShowNotification(`Alert set for ₹${target.toLocaleString('en-IN')}`);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast Notification */}
      {showNotification && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center">
            <Bell className="w-5 h-5 mr-3" />
            <span className="font-medium">{showNotification}</span>
          </div>
        </div>
      )}

      {/* Sidebar/Navigation Replacement for layout */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              SmartPrice AI
            </h1>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Paste product link or search name..."
              className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50/50 rounded-2xl py-2.5 pl-11 pr-4 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="flex items-center space-x-4">
            <button className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl relative transition-colors">
              <Bell className="w-6 h-6" />
              {alerts.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://picsum.photos/seed/user/100/100" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Section: List & Alerts */}
        <div className="lg:col-span-4 space-y-8">
          {/* Active Alerts */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <Bell className="w-5 h-5 mr-2 text-indigo-600" />
                Active Alerts
              </h2>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                {alerts.length}
              </span>
            </div>
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4 italic">No price alerts set</p>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 flex-1 pr-2">{alert.productName}</h3>
                      <button onClick={() => removeAlert(alert.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-slate-500">Target: <span className="font-bold text-indigo-600">₹{alert.targetPrice.toLocaleString('en-IN')}</span></div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">{alert.createdAt}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Recent Products */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-6 flex items-center">
              <PackageSearch className="w-5 h-5 mr-2 text-indigo-600" />
              Tracked Items
            </h2>
            <div className="space-y-4">
              {products.map(product => (
                <button 
                  key={product.id}
                  onClick={() => setSelectedProductId(product.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center space-x-4 ${
                    selectedProductId === product.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-100' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <img src={product.image} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt="" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-800 truncate">{product.name}</h3>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-lg font-bold text-slate-900">₹{product.currentPrice.toLocaleString('en-IN')}</span>
                      {product.analysis && (
                        <div className={`w-2 h-2 rounded-full ${
                          product.analysis.decision === PurchaseDecision.BUY_NOW ? 'bg-emerald-500' :
                          product.analysis.decision === PurchaseDecision.WAIT ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right Section: Deep Dive Content */}
        <div className="lg:col-span-8 space-y-8">
          {!selectedProduct ? (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
              <PackageSearch className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium text-center px-8">Search or select a product to see aggregated prices from 10+ e-commerce platforms and AI timing insights</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Product Info Header */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-1/3">
                    <img src={selectedProduct.image} className="w-full h-auto rounded-2xl shadow-lg border border-slate-100" alt={selectedProduct.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{selectedProduct.category}</span>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedProduct.name}</h2>
                    
                    <div className="flex flex-wrap items-end gap-6 mb-8">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Best Current Price</p>
                        <p className="text-4xl font-extrabold text-slate-900">₹{selectedProduct.currentPrice.toLocaleString('en-IN')}</p>
                      </div>
                      
                      {selectedProduct.analysis && (
                        <div className="flex flex-col items-start gap-2">
                          <p className="text-sm text-slate-500">AI Recommendation</p>
                          <DecisionBadge decision={selectedProduct.analysis.decision} />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={() => addAlert(selectedProduct)}
                        className="flex-1 bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-2xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-100 transition-all flex items-center justify-center space-x-2"
                      >
                        <Bell className="w-5 h-5" />
                        <span>Set Price Alert</span>
                      </button>
                      <button 
                        className="flex-1 bg-white border-2 border-slate-100 text-slate-800 font-bold py-3.5 px-6 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add to Watchlist</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis & Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Price History Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold flex items-center">
                      <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
                      Price Trend
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
                      <span className="text-xs text-slate-500 font-medium">History</span>
                      <span className="w-3 h-3 rounded-full bg-indigo-600 opacity-30"></span>
                      <span className="text-xs text-slate-500 font-medium">Forecast</span>
                    </div>
                  </div>
                  <PriceChart 
                    data={selectedProduct.historicalPrices} 
                    predictedPrice={selectedProduct.analysis?.predictedPrice} 
                  />
                  {selectedProduct.analysis && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          {selectedProduct.analysis.decision === PurchaseDecision.WAIT ? <TrendingDown className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Predicted for Next Week</p>
                          <p className="text-lg font-bold text-slate-900">₹{selectedProduct.analysis.predictedPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Confidence</p>
                        <p className="text-lg font-bold text-indigo-600">{selectedProduct.analysis.confidence}%</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Explainable AI Analysis */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 relative overflow-hidden">
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-600 font-bold animate-pulse">AI Agent Thinking...</p>
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold mb-6 flex items-center">
                    <ShieldCheck className="w-6 h-6 mr-2 text-indigo-600" />
                    Explainable AI Insights
                  </h3>
                  
                  {selectedProduct.analysis ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        {selectedProduct.analysis.reasoning.map((point, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold">{idx + 1}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{point}</p>
                          </div>
                        ))}
                      </div>

                      <hr className="border-slate-100" />

                      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                        <div className="flex items-center space-x-3">
                          {selectedProduct.analysis.authenticDiscount ? (
                            <ShieldCheck className="w-6 h-6 text-emerald-500" />
                          ) : (
                            <ShieldAlert className="w-6 h-6 text-rose-500" />
                          )}
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {selectedProduct.analysis.authenticDiscount ? 'Genuine Discount' : 'Suspicious Pricing'}
                            </p>
                            <p className="text-xs text-slate-500">Discount Authenticity Score</p>
                          </div>
                        </div>
                        <div className="text-2xl font-black text-slate-900">
                          {selectedProduct.analysis.discountScore}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-400 italic">Analysis will appear here...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Platform Comparison */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Compare Across All Platforms</h3>
                  <p className="text-sm text-slate-500">Real-time prices from across the web</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Store</th>
                        <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Current Price</th>
                        <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Inventory</th>
                        <th className="pb-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {[...selectedProduct.platforms].sort((a,b) => a.price - b.price).map((plat, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                          <td className="py-5">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {plat.platform.charAt(0)}
                              </div>
                              <span className="font-bold text-slate-800">{plat.platform}</span>
                            </div>
                          </td>
                          <td className="py-5">
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-bold ${plat.price <= selectedProduct.currentPrice ? 'text-indigo-600' : 'text-slate-900'}`}>
                                ₹{plat.price.toLocaleString('en-IN')}
                              </span>
                              {plat.price <= selectedProduct.currentPrice && (
                                <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">BEST PRICE</span>
                              )}
                            </div>
                          </td>
                          <td className="py-5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                              plat.availability 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                              : 'bg-slate-50 text-slate-400 border-slate-100'
                            }`}>
                              {plat.availability ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <button className="inline-flex items-center space-x-2 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                              <span>View Deal</span>
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 mt-12 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
        <p>© 2024 SmartPrice AI Assistant. All data is real-time aggregated.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Browser Extension</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
