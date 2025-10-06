import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Trophy, AlertTriangle, CheckCircle, Star, Award, Crown } from 'lucide-react';
import { listSales } from '../../services/sales';
import { useAuth } from '../../contexts/AuthContext';

interface SalesmanSalesProps {
  openSaleForm?: (prefill?: any) => void;
}

interface Level {
  id: string;
  name: string;
  minGanji: number;
  maxGanji: number | null;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
}

const TargetManagement: React.FC = () => {
  const { user } = useAuth();
  const [mySales, setMySales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define the 6 levels based on ganji (profit)
  const levels: Level[] = [
    {
      id: 'beginner',
      name: 'Beginner',
      minGanji: 0,
      maxGanji: 200000,
      icon: <Star className="h-5 w-5" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      description: 'Starting your sales journey'
    },
    {
      id: 'junior',
      name: 'Junior',
      minGanji: 200000,
      maxGanji: 499999,
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      description: 'Building momentum'
    },
    {
      id: 'amateur',
      name: 'Amateur',
      minGanji: 500000,
      maxGanji: 799999,
      icon: <Target className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
      description: 'Gaining experience'
    },
    {
      id: 'professional',
      name: 'Professional',
      minGanji: 800000,
      maxGanji: 999999,
      icon: <Award className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      description: 'Proven performer'
    },
    {
      id: 'master',
      name: 'Master',
      minGanji: 1000000,
      maxGanji: 1999999,
      icon: <Trophy className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      description: 'Elite salesperson'
    },
    {
      id: 'pro',
      name: 'Pro',
      minGanji: 2000000,
      maxGanji: null,
      icon: <Crown className="h-5 w-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
      description: 'Sales legend'
    }
  ];

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await listSales({ salesman_id: String(user.id) });
        setMySales(data);
      } catch (e: any) {
        setError(e.message || 'Failed to load sales');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  // Calculate total ganji (profit)
  const totalGanji = mySales.reduce((sum, sale) => {
    const ganji = (Number(sale.unit_price) - Number(sale.cost_price)) * Number(sale.quantity);
    return sum + ganji;
  }, 0);

  // Determine current level
  const getCurrentLevel = () => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (totalGanji >= levels[i].minGanji) {
        return levels[i];
      }
    }
    return levels[0]; // Default to beginner
  };

  // Get next level
  const getNextLevel = () => {
    const currentLevel = getCurrentLevel();
    const currentIndex = levels.findIndex(level => level.id === currentLevel.id);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  // Calculate progress to next level
  const getLevelProgress = () => {
    const currentLevel = getCurrentLevel();
    const nextLevel = getNextLevel();

    if (!nextLevel) {
      return { progress: 100, remaining: 0 };
    }

    const levelRange = nextLevel.minGanji - currentLevel.minGanji;
    const progressInLevel = totalGanji - currentLevel.minGanji;
    const progress = (progressInLevel / levelRange) * 100;

    return {
      progress: Math.min(progress, 100),
      remaining: Math.max(0, nextLevel.minGanji - totalGanji)
    };
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const levelProgress = getLevelProgress();

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sales Levels & Targets
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your progress through sales mastery levels based on profit earned
          </p>
        </div>
      </div>

      {/* Current Level Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className={`w-16 h-16 ${currentLevel.bgColor} rounded-full flex items-center justify-center mr-4`}>
              <span className={currentLevel.color}>{currentLevel.icon}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentLevel.name} Level
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentLevel.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Profit (Ganji)</p>
            <p className="text-2xl font-bold text-green-600">TSh {formatCurrency(totalGanji)}</p>
          </div>
        </div>

        {/* Progress to Next Level */}
        {nextLevel && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Progress to {nextLevel.name}</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                TSh {formatCurrency(totalGanji)} / TSh {formatCurrency(nextLevel.minGanji)}
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300`}
                style={{ width: `${levelProgress.progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {levelProgress.progress.toFixed(1)}% Complete
              </span>
              <span className="font-medium text-orange-600">
                TSh {formatCurrency(levelProgress.remaining)} remaining
              </span>
            </div>
          </div>
        )}

        {!nextLevel && (
          <div className="text-center py-4">
            <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
              Congratulations! You've reached the highest level!
            </p>
          </div>
        )}
      </div>

      {/* All Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.map((level, index) => {
          const isCurrentLevel = level.id === currentLevel.id;
          const isCompleted = totalGanji >= (level.maxGanji || level.minGanji);
          const isNextLevel = nextLevel && level.id === nextLevel.id;

          return (
            <div
              key={level.id}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 transition-all duration-200 ${
                isCurrentLevel
                  ? 'border-blue-500 shadow-blue-200 dark:shadow-blue-900'
                  : isCompleted
                  ? 'border-green-500'
                  : isNextLevel
                  ? 'border-orange-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {isCurrentLevel && (
                <div className="absolute -top-3 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  CURRENT LEVEL
                </div>
              )}

              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${level.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                  <span className={level.color}>{level.icon}</span>
                </div>
                <div>
                  <h3 className={`font-semibold ${isCurrentLevel ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                    {level.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Level {index + 1}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p className="font-medium mb-1">Profit Range:</p>
                  <p>
                    TSh {formatCurrency(level.minGanji)}
                    {level.maxGanji ? ` - TSh ${formatCurrency(level.maxGanji)}` : '+'}
                  </p>
                </div>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>{level.description}</p>
                </div>

                {isCompleted && (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Completed
                  </div>
                )}

                {isCurrentLevel && (
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    In Progress
                  </div>
                )}

                {isNextLevel && (
                  <div className="flex items-center text-orange-600 dark:text-orange-400 text-sm font-medium">
                    <Target className="h-4 w-4 mr-1" />
                    Next Level
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Benefits/Rewards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Trophy className="h-5 w-5 mr-2" />
          Level Benefits & Rewards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Commission Rates</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm">Beginner - Junior</span>
                <span className="font-medium text-green-600">3-5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm">Amateur - Professional</span>
                <span className="font-medium text-green-600">5-7%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm">Master - Pro</span>
                <span className="font-medium text-green-600">7-10%</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Bonuses</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm">Professional Level</span>
                <span className="font-medium text-blue-600">TSh 50,000</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm">Master Level</span>
                <span className="font-medium text-blue-600">TSh 100,000</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-sm">Pro Level</span>
                <span className="font-medium text-blue-600">TSh 200,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your sales data...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};

export default TargetManagement;