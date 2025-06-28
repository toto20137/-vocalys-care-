import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Phone, TrendingUp, TrendingDown, Activity, Users, Server, Database, Wifi, Battery } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: any;
  description: string;
}

interface Alert {
  id: string;
  type: 'system' | 'user' | 'call' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

export default function MonitoringScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const timeframes = [
    { value: '1h', label: '1h' },
    { value: '24h', label: '24h' },
    { value: '7d', label: '7j' },
    { value: '30d', label: '30j' }
  ];

  // Mock system metrics
  const systemMetrics: SystemMetric[] = [
    {
      id: '1',
      name: 'Appels IA',
      value: '99.8%',
      status: 'healthy',
      trend: 'stable',
      icon: Phone,
      description: 'Taux de succès des appels'
    },
    {
      id: '2',
      name: 'Serveurs',
      value: '4/4',
      status: 'healthy',
      trend: 'stable',
      icon: Server,
      description: 'Serveurs opérationnels'
    },
    {
      id: '3',
      name: 'Base de données',
      value: '2.3ms',
      status: 'healthy',
      trend: 'up',
      icon: Database,
      description: 'Temps de réponse moyen'
    },
    {
      id: '4',
      name: 'Utilisateurs actifs',
      value: '1,247',
      status: 'healthy',
      trend: 'up',
      icon: Users,
      description: 'Utilisateurs connectés'
    },
    {
      id: '5',
      name: 'Réseau',
      value: '156ms',
      status: 'warning',
      trend: 'down',
      icon: Wifi,
      description: 'Latence réseau'
    },
    {
      id: '6',
      name: 'Stockage',
      value: '78%',
      status: 'warning',
      trend: 'up',
      icon: Battery,
      description: 'Utilisation du stockage'
    }
  ];

  // Mock alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'system',
      severity: 'high',
      title: 'Latence réseau élevée',
      description: 'La latence réseau dépasse le seuil de 150ms depuis 15 minutes',
      timestamp: 'Il y a 15 minutes',
      resolved: false
    },
    {
      id: '2',
      type: 'call',
      severity: 'medium',
      title: 'Échec d\'appel récurrent',
      description: 'Utilisateur Marie Dubois - 3 échecs consécutifs',
      timestamp: 'Il y a 1 heure',
      resolved: false
    },
    {
      id: '3',
      type: 'user',
      severity: 'low',
      title: 'Pic d\'activité',
      description: 'Augmentation de 25% des connexions simultanées',
      timestamp: 'Il y a 2 heures',
      resolved: true
    },
    {
      id: '4',
      type: 'security',
      severity: 'critical',
      title: 'Tentative d\'accès non autorisé',
      description: 'Plusieurs tentatives de connexion échouées depuis IP 192.168.1.100',
      timestamp: 'Il y a 3 heures',
      resolved: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return Activity;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'system': return Server;
      case 'call': return Phone;
      case 'user': return Users;
      case 'security': return Shield;
      default: return AlertTriangle;
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monitoring Système</Text>
        <View style={styles.statusIndicator}>
          <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.statusText}>Opérationnel</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Timeframe Selector */}
        <View style={styles.timeframeSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.timeframeButtons}>
              {timeframes.map((timeframe) => (
                <TouchableOpacity
                  key={timeframe.value}
                  style={[
                    styles.timeframeButton,
                    selectedTimeframe === timeframe.value && styles.timeframeButtonSelected
                  ]}
                  onPress={() => setSelectedTimeframe(timeframe.value)}
                >
                  <Text style={[
                    styles.timeframeText,
                    selectedTimeframe === timeframe.value && styles.timeframeTextSelected
                  ]}>
                    {timeframe.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* System Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vue d'ensemble du système</Text>
          <View style={styles.metricsGrid}>
            {systemMetrics.map((metric) => {
              const TrendIcon = getTrendIcon(metric.trend);
              return (
                <View key={metric.id} style={styles.metricCard}>
                  <View style={styles.metricHeader}>
                    <View style={[styles.metricIcon, { backgroundColor: getStatusColor(metric.status) + '20' }]}>
                      <metric.icon size={20} color={getStatusColor(metric.status)} />
                    </View>
                    <View style={styles.metricTrend}>
                      <TrendIcon size={16} color={getStatusColor(metric.status)} />
                    </View>
                  </View>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <Text style={styles.metricDescription}>{metric.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Active Alerts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Alertes actives</Text>
            <View style={styles.alertsBadge}>
              <Text style={styles.alertsBadgeText}>{activeAlerts.length}</Text>
            </View>
          </View>

          {activeAlerts.length === 0 ? (
            <View style={styles.noAlertsCard}>
              <CheckCircle size={48} color="#10B981" />
              <Text style={styles.noAlertsTitle}>Aucune alerte active</Text>
              <Text style={styles.noAlertsText}>Tous les systèmes fonctionnent normalement</Text>
            </View>
          ) : (
            activeAlerts.map((alert) => {
              const AlertIcon = getAlertIcon(alert.type);
              return (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertInfo}>
                      <View style={[styles.alertIcon, { backgroundColor: getSeverityColor(alert.severity) + '20' }]}>
                        <AlertIcon size={20} color={getSeverityColor(alert.severity)} />
                      </View>
                      <View style={styles.alertContent}>
                        <Text style={styles.alertTitle}>{alert.title}</Text>
                        <Text style={styles.alertDescription}>{alert.description}</Text>
                        <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.resolveButton}
                      onPress={() => resolveAlert(alert.id)}
                    >
                      <Text style={styles.resolveButtonText}>Résoudre</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          {resolvedAlerts.slice(0, 3).map((alert) => {
            const AlertIcon = getAlertIcon(alert.type);
            return (
              <View key={alert.id} style={styles.activityCard}>
                <View style={styles.activityIcon}>
                  <AlertIcon size={16} color="#6B7280" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{alert.title}</Text>
                  <Text style={styles.activityTime}>{alert.timestamp}</Text>
                </View>
                <View style={styles.resolvedBadge}>
                  <CheckCircle size={16} color="#10B981" />
                </View>
              </View>
            );
          })}
        </View>

        {/* System Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistiques système</Text>
          <View style={styles.statsCard}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Uptime</Text>
              <Text style={styles.statValue}>99.9% (30j)</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Appels traités</Text>
              <Text style={styles.statValue}>47,392</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Temps de réponse moyen</Text>
              <Text style={styles.statValue}>234ms</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Erreurs</Text>
              <Text style={[styles.statValue, { color: '#EF4444' }]}>0.2%</Text>
            </View>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  content: {
    flex: 1,
  },
  timeframeSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  timeframeButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 8,
  },
  timeframeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeframeButtonSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timeframeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  timeframeTextSelected: {
    color: '#FFFFFF',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  alertsBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  alertsBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: (width - 52) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricTrend: {
    padding: 4,
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  metricName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  metricDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  noAlertsCard: {
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
  noAlertsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noAlertsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  alertInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  alertTimestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  resolveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  resolveButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  resolvedBadge: {
    padding: 4,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
});