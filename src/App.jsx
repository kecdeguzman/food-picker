import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Coffee, Moon, Sun, Sparkles, ArrowLeft, Wand2, RefreshCw } from 'lucide-react';
import RouletteWheel from './components/RouletteWheel';

const MASTER_MEAL_DATA = {
  breakfast: {
    id: 'breakfast',
    title: 'Breakfast',
    icon: Coffee,
    standardItems: ['Tapsilog', 'Tocilog', 'Pandesal & Coffee', 'Oatmeal', 'Pancit Canton', 'Fruit Bowl', 'Champorado', 'Bacon & Eggs Skillet', 'Belgian Waffles', 'Sopas', 'Arroz Caldo', 'Taho', 'Lugaw with Egg', 'Tortang Talong', 'Hotdog & Rice', 'Danggit', 'Sardinas', 'Tinapang Bangus', 'Spanish Bread', 'Ensaymada', 'Cereal', 'Instant Noodles with Egg'],
    fastFoodItems: ['Jollibee Breakfast Yum', 'McDo Hashbrown', 'Burger King Croissanwich', 'Chowking Fried Rice', 'Jollibee Longganisa', 'McDo Hotcakes', 'KFC Breakfast Bowl', 'Dunkin Donuts Combo', '7-Eleven Siopao', 'Wendy\'s Breakfast']
  },
  lunch: {
    id: 'lunch',
    title: 'Lunch',
    icon: Sun,
    standardItems: ['Chicken Adobo', 'Pork Sinigang', 'Pastil', 'Chicken Proben', 'Bulcachong', 'Salad', 'Pasta', 'Fried Chicken', 'Baby Back Ribs', 'Katsu Curry', 'Shawarma Rice', 'Lechon Kawali', 'Bistek Tagalog', 'Kare-Kare', 'Monggo', 'Sisig', 'Pininyahang Manok', 'Samgyupsal', 'Inihaw na Bangus', 'Bicol Express', 'Dinuguan', 'Laing', 'Chopsuey', 'Pork BBQ on Stick', 'Chicken Curry', 'Tuna Panga'],
    fastFoodItems: ['Jollibee Chickenjoy', 'McDo BigMac Meal', 'KFC Zinger Combo', 'Mang Inasal PM1', 'Chowking Chao Fan', 'Burger King Whopper', 'Tokyo Tokyo Bento', 'Army Navy Burger', 'Jollibee Burger Steak', 'Greenwich Pizza', 'S&R Slice Pizza']
  },
  dinner: {
    id: 'dinner',
    title: 'Dinner',
    icon: Moon,
    standardItems: ['Steak', 'Grilled Fish', 'Pizza', 'Soup & Bread', 'Stir-fry Noodles', 'Pork Belly BBQ', 'Shrimp Boil', 'Ramen', 'Tinola', 'Nilagang Baka', 'Crispy Pata', 'Chicken Fillet', 'Burger & Fries', 'Bacolod Inasal', 'Beef Pares', 'Lumpia Shanghai', 'Buttered Shrimp', 'Sweet and Sour Fish', 'Chicken Wings', 'Pork Menudo', 'Beef Caldereta', 'Pancit Bihon', 'Kinilaw na Malasugi'],
    fastFoodItems: ['Jollibee Spicy Chicken', 'McDo Quarter Pounder', 'KFC Famous Bowl', 'Chowking Lauriat', 'BonChon Chicken', 'Yellow Cab Pizza', 'Panda Express', 'Jollibee Super Meal', 'McDo BFF Burger', 'Pizza Hut Pan', 'Potato Corner Mega']
  }
};

function getRandomSubset(arr, size) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

function App() {
  const [activeMeal, setActiveMeal] = useState('lunch');
  const [showRoulette, setShowRoulette] = useState(false);
  const [includeFastFood, setIncludeFastFood] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [suggestions, setSuggestions] = useState({
    breakfast: { standard: [], fastFood: [] },
    lunch: { standard: [], fastFood: [] },
    dinner: { standard: [], fastFood: [] }
  });

  const shuffleSuggestions = () => {
    setIsRefreshing(true);
    const newSuggestions = {};
    Object.keys(MASTER_MEAL_DATA).forEach(meal => {
      newSuggestions[meal] = {
        standard: getRandomSubset(MASTER_MEAL_DATA[meal].standardItems, 8),
        fastFood: getRandomSubset(MASTER_MEAL_DATA[meal].fastFoodItems, 4)
      };
    });
    
    // Add a tiny delay to allow the animation refresh to look deliberate
    setTimeout(() => {
      setSuggestions(newSuggestions);
      setIsRefreshing(false);
    }, 200);
  };

  useEffect(() => {
    // initialize on first load
    shuffleSuggestions();
  }, []);

  const currentMealObj = MASTER_MEAL_DATA[activeMeal];
  const currentSuggestions = suggestions[activeMeal] || { standard: [], fastFood: [] };
  
  const displayedItems = includeFastFood 
    ? [...currentSuggestions.standard, ...currentSuggestions.fastFood] 
    : currentSuggestions.standard;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      
      {/* Navbar */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
              <Utensils size={20} />
            </div>
            <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              Ulam<span className="text-brand-500">Picker</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide"
          >
            <Sparkles size={16} />
            <span>Never skip a meal</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight"
          >
            Can't decide what to eat? <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-orange-500">
              Pick from the list or spin!
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-lg"
          >
            Choose your meal time below and view the options, or let the wheel decide your fate!
          </motion.p>
        </div>

        {/* Meal Selection Tabs */}
        <div className="w-full max-w-[340px] sm:max-w-md bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-sm flex mb-8 overflow-x-auto no-scrollbar">
          {Object.values(MASTER_MEAL_DATA).map((meal) => {
            const Icon = meal.icon;
            const isActive = activeMeal === meal.id;
            return (
              <button
                key={meal.id}
                onClick={() => {
                  setActiveMeal(meal.id);
                  setShowRoulette(false);
                }}
                className={`relative flex-[1_0_auto] min-w-[100px] flex items-center justify-center space-x-2 py-3 px-2 sm:px-4 rounded-2xl text-sm font-bold transition-colors z-10 ${
                  isActive ? 'text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-brand-500 rounded-2xl -z-10 shadow-md shadow-brand-500/30" 
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon size={16} className="hidden sm:block" />
                <span>{meal.title}</span>
              </button>
            )
          })}
        </div>
        
        {/* Main Area */}
        <AnimatePresence mode="wait">
          {!showRoulette ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-4xl flex flex-col items-center"
            >
              {/* Controls Row: Shuffle + Fast Food Toggle + I'm Feeling Lucky */}
              <div className="flex flex-col sm:flex-row items-center justify-between w-full mb-10 gap-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
                
                <div className="flex items-center space-x-6 w-full sm:w-auto">
                  {/* Shuffle Button */}
                  <button 
                    onClick={shuffleSuggestions}
                    className="p-3 bg-brand-100 hover:bg-brand-200 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-600 dark:text-brand-400 rounded-xl transition-all shadow-sm flex items-center justify-center group flex-shrink-0"
                    title="Get New Suggestions"
                  >
                    <RefreshCw size={24} className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                  </button>

                  {/* Fast Food Toggle */}
                  <label className="flex items-center space-x-3 cursor-pointer group flex-1">
                    <div className="relative flex-shrink-0">
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={includeFastFood}
                        onChange={() => setIncludeFastFood(!includeFastFood)}
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${includeFastFood ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${includeFastFood ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 dark:text-slate-200 select-none group-hover:text-brand-500 transition-colors">
                        Include Fast Food
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 select-none hidden sm:block">
                        Craving something quick?
                      </span>
                    </div>
                  </label>
                </div>

                {/* I'm Feeling Lucky Button */}
                <button 
                  onClick={() => setShowRoulette(true)}
                  className="px-6 py-4 w-full sm:w-auto bg-gradient-to-br from-orange-400 to-brand-500 hover:from-orange-500 hover:to-brand-600 text-white font-black tracking-widest rounded-2xl shadow-xl shadow-brand-500/25 border-b-4 border-brand-600 hover:border-b-0 hover:translate-y-1 active:transform-none transition-all flex items-center justify-center space-x-3 text-lg flex-shrink-0"
                >
                  <Wand2 size={24} />
                  <span>I'M FEELING LUCKY</span>
                </button>
              </div>

              {/* Viands Grid */}
              <div className="w-full text-center">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center justify-center gap-2">
                  <span>Possible {currentMealObj.title} Options</span>
                  <span className="text-sm font-normal text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">{displayedItems.length} selected</span>
                </h3>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                  <AnimatePresence mode="popLayout">
                    {!isRefreshing && displayedItems.map((item, index) => {
                       const isFastFood = currentMealObj.fastFoodItems.includes(item);
                       return (
                        <motion.div 
                          key={`${item}-${activeMeal}`}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2, delay: index * 0.03 }}
                          className={`backdrop-blur-sm p-4 rounded-3xl shadow-sm border text-center flex items-center justify-center min-h-[100px] transition-all cursor-default
                            ${isFastFood 
                              ? 'bg-orange-50/80 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 hover:border-orange-400' 
                              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-brand-400 hover:shadow-md'
                            }`}
                        >
                          <span className={`font-bold text-[15px] ${isFastFood ? 'text-orange-700 dark:text-orange-300' : 'text-slate-700 dark:text-slate-200'}`}>
                            {item}
                          </span>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="roulette-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setShowRoulette(false)}
                className="mb-6 flex items-center space-x-2 text-slate-500 dark:text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors font-bold"
              >
                <ArrowLeft size={20} />
                <span>Back to List</span>
              </button>

              <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[3rem] p-6 md:p-12 shadow-2xl w-full max-w-lg overflow-hidden">
                  <RouletteWheel items={displayedItems} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
      
    </div>
  );
}

export default App;
