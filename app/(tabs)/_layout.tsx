import { Tabs } from 'expo-router';
import { Chrome as Home, Users, ChartBar as BarChart3, Settings, Building2, Shield } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

export default function TabLayout() {
  const { user } = useAuth();

  const getTabsForRole = () => {
    if (user?.role === 'admin') {
      return [
        {
          name: 'index',
          title: 'Dashboard',
          icon: BarChart3,
        },
        {
          name: 'users',
          title: 'Utilisateurs',
          icon: Users,
        },
        {
          name: 'monitoring',
          title: 'Monitoring',
          icon: Shield,
        },
        {
          name: 'settings',
          title: 'Paramètres',
          icon: Settings,
        },
      ];
    }

    if (user?.role === 'municipality') {
      return [
        {
          name: 'index',
          title: 'Dashboard',
          icon: Home,
        },
        {
          name: 'beneficiaries',
          title: 'Bénéficiaires',
          icon: Users,
        },
        {
          name: 'reports',
          title: 'Rapports',
          icon: BarChart3,
        },
        {
          name: 'settings',
          title: 'Paramètres',
          icon: Settings,
        },
      ];
    }

    // Default family tabs
    return [
      {
        name: 'index',
        title: 'Accueil',
        icon: Home,
      },
      {
        name: 'beneficiaries',
        title: 'Proches',
        icon: Users,
      },
      {
        name: 'reports',
        title: 'Rapports',
        icon: BarChart3,
      },
      {
        name: 'settings',
        title: 'Paramètres',
        icon: Settings,
      },
    ];
  };

  const tabs = getTabsForRole();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
        },
      }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ size, color }) => (
              <tab.icon size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}