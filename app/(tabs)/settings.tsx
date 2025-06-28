import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert
} from 'react-native';
import { User, Bell, CreditCard, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Moon, Sun, Phone, Mail, Calendar, Download } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [callReminders, setCallReminders] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const settingsMenus = [
    {
      title: 'Compte',
      items: [
        {
          icon: User,
          label: 'Informations personnelles',
          value: user?.email || '',
          onPress: () => console.log('Profile settings')
        },
        {
          icon: CreditCard,
          label: 'Abonnement',
          value: user?.subscriptionStatus === 'active' ? 'Actif' : 'Inactif',
          onPress: () => console.log('Subscription settings')
        }
      ]
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          label: 'Notifications push',
          hasSwitch: true,
          value: notifications,
          onPress: () => setNotifications(!notifications)
        },
        {
          icon: Phone,
          label: 'Rappels d\'appels',
          hasSwitch: true,
          value: callReminders,
          onPress: () => setCallReminders(!callReminders)
        },
        {
          icon: Shield,
          label: 'Alertes d\'urgence',
          hasSwitch: true,
          value: emergencyAlerts,
          onPress: () => setEmergencyAlerts(!emergencyAlerts)
        }
      ]
    },
    {
      title: 'Préférences',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: 'Mode sombre',
          hasSwitch: true,
          value: darkMode,
          onPress: () => setDarkMode(!darkMode)
        },
        {
          icon: Calendar,
          label: 'Horaires d\'appels',
          value: 'Configurer',
          onPress: () => console.log('Schedule settings')
        },
        {
          icon: Download,
          label: 'Sauvegarde des données',
          value: 'Exporter',
          onPress: () => console.log('Data export')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Centre d\'aide',
          value: '',
          onPress: () => console.log('Help center')
        },
        {
          icon: Mail,
          label: 'Nous contacter',
          value: 'support@vocalyscare.fr',
          onPress: () => console.log('Contact support')
        },
        {
          icon: Shield,
          label: 'Politique de confidentialité',
          value: '',
          onPress: () => console.log('Privacy policy')
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <Text style={styles.profileRole}>
                {user?.role === 'family' ? 'Compte Famille' : 
                 user?.role === 'municipality' ? 'Compte Collectivité' : 
                 'Administrateur'}
              </Text>
            </View>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsMenus.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.settingItemLast
                  ]}
                  onPress={item.onPress}
                  disabled={item.hasSwitch}
                >
                  <View style={styles.settingLeft}>
                    <View style={styles.settingIcon}>
                      <item.icon size={20} color="#6B7280" />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingLabel}>{item.label}</Text>
                      {item.value && !item.hasSwitch && (
                        <Text style={styles.settingValue}>{item.value}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    {item.hasSwitch ? (
                      <Switch
                        value={item.value as boolean}
                        onValueChange={() => item.onPress()}
                        trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                        thumbColor={'#FFFFFF'}
                      />
                    ) : (
                      <ChevronRight size={20} color="#9CA3AF" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Subscription Info */}
        {user?.role === 'family' && (
          <View style={styles.subscriptionCard}>
            <Text style={styles.subscriptionTitle}>Votre abonnement</Text>
            <Text style={styles.subscriptionStatus}>
              {user.subscriptionStatus === 'active' ? 'Plan Premium Actif' : 'Plan d\'essai'}
            </Text>
            <Text style={styles.subscriptionDetails}>
              {user.subscriptionStatus === 'active' 
                ? 'Renouvellement automatique le 15 février 2024'
                : '14 jours d\'essai gratuit restants'
              }
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>
                {user.subscriptionStatus === 'active' ? 'Gérer l\'abonnement' : 'Passer au Premium'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>Vocalys Care v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2024 Vocalys Technologies</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingRight: {
    marginLeft: 12,
  },
  subscriptionCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  subscriptionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subscriptionStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginBottom: 8,
  },
  subscriptionDetails: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  upgradeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appInfoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 4,
  },
});