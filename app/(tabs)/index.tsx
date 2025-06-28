import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Heart, TriangleAlert as AlertTriangle, TrendingUp, Calendar, MessageCircle, Users, Clock, CircleCheck as CheckCircle, ChartBar as BarChart3, Play } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { ApiService } from '@/services/api';

interface CallSummary {
  id: string;
  beneficiaryName: string;
  date: string;
  duration: string;
  mood: 'positive' | 'neutral' | 'negative';
  summary: string;
  alerts: string[];
}

interface QuickStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: any;
}

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalCalls: 0,
    averageDuration: 0,
    responseRate: 0,
    positiveRatio: 0,
    alertsCount: 0
  });
  const [recentCalls, setRecentCalls] = useState<CallSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Charger les statistiques
      const statsData = await ApiService.getStats(user.id);
      setStats(statsData);

      // Charger les résumés récents
      const summariesData = await ApiService.getCallSummaries(user.id);
      const formattedCalls = summariesData.map((summary: any) => ({
        id: summary.id,
        beneficiaryName: summary.calls.beneficiaries.name,
        date: new Date(summary.created_at).toLocaleDateString('fr-FR'),
        duration: `${Math.floor((summary.calls.duration || 0) / 60)}min`,
        mood: summary.mood,
        summary: summary.summary,
        alerts: summary.concerns || []
      }));
      
      setRecentCalls(formattedCalls);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const quickStats: QuickStat[] = [
    {
      label: 'Appels cette semaine',
      value: stats.totalCalls.toString(),
      change: '+3',
      positive: true,
      icon: Phone
    },
    {
      label: 'Humeur générale',
      value: `${stats.positiveRatio}%`,
      change: '+5%',
      positive: true,
      icon: Heart
    },
    {
      label: 'Taux de réponse',
      value: `${stats.responseRate}%`,
      change: '-2%',
      positive: false,
      icon: CheckCircle
    },
    {
      label: 'Alertes actives',
      value: stats.alertsCount.toString(),
      change: '+1',
      positive: false,
      icon: AlertTriangle
    }
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        style={styles.header}
      >
        <Text style={styles.greeting}>Bonjour {user?.name}</Text>
        <Text style={styles.subtitle}>
          Voici le résumé de l'activité de vos proches
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          {quickStats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <stat.icon size={20} color="#6B7280" />
                <Text style={[
                  styles.statChange,
                  { color: stat.positive ? '#10B981' : '#EF4444' }
                ]}>
                  {stat.change}
                </Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent Calls */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Derniers appels</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {recentCalls.length === 0 ? (
            <View style={styles.emptyState}>
              <Phone size={48} color="#9CA3AF" />
              <Text style={styles.emptyStateTitle}>Aucun appel récent</Text>
              <Text style={styles.emptyStateText}>
                Les appels à vos proches apparaîtront ici
              </Text>
            </View>
          ) : (
            recentCalls.map((call) => (
              <View key={call.id} style={styles.callCard}>
                <View style={styles.callHeader}>
                  <View style={styles.callMeta}>
                    <Text style={styles.beneficiaryName}>{call.beneficiaryName}</Text>
                    <Text style={styles.callDate}>{call.date}</Text>
                  </View>
                  <View style={styles.callStats}>
                    <Text style={styles.callDuration}>{call.duration}</Text>
                    <Text style={styles.moodEmoji}>{getMoodIcon(call.mood)}</Text>
                  </View>
                </View>
                
                <Text style={styles.callSummary}>{call.summary}</Text>
                
                {call.alerts.length > 0 && (
                  <View style={styles.alertsContainer}>
                    {call.alerts.map((alert, index) => (
                      <View key={index} style={styles.alertTag}>
                        <AlertTriangle size={12} color="#F59E0B" />
                        <Text style={styles.alertText}>{alert}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <Users size={24} color="#2563EB" />
              <Text style={styles.actionText}>Gérer les proches</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Calendar size={24} color="#2563EB" />
              <Text style={styles.actionText}>Planifier appels</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <MessageCircle size={24} color="#2563EB" />
              <Text style={styles.actionText}>Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <BarChart3 size={24} color="#2563EB" />
              <Text style={styles.actionText}>Statistiques</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#C7D2FE',
  },
  content: {
    padding: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statChange: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  callCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  callMeta: {
    flex: 1,
  },
  beneficiaryName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  callDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  callStats: {
    alignItems: 'flex-end',
  },
  callDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  moodEmoji: {
    fontSize: 20,
  },
  callSummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  alertsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  alertTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  alertText: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    color: '#D97706',
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    minWidth: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
    marginTop: 8,
    textAlign: 'center',
  },
});