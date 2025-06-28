import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Calendar, Download, Filter, TrendingUp, TrendingDown, ChartBar as BarChart3, ChartPie as PieChart, Clock, Heart, Phone, TriangleAlert as AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Report {
  id: string;
  beneficiaryName: string;
  date: string;
  duration: string;
  mood: 'positive' | 'neutral' | 'negative';
  summary: string;
  keywords: string[];
  healthMentions: string[];
  concerns: string[];
}

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('all');

  // Mock data
  const reports: Report[] = [
    {
      id: '1',
      beneficiaryName: 'Grand-mère Marie',
      date: '2024-01-15',
      duration: '8min',
      mood: 'positive',
      summary: 'Conversation très positive. Marie a parlé de ses activités de jardinage et de la visite de ses petits-enfants le week-end dernier. Elle semble en très bonne forme physique et morale.',
      keywords: ['jardin', 'petits-enfants', 'visite', 'content'],
      healthMentions: ['forme physique excellente', 'sommeil réparateur'],
      concerns: []
    },
    {
      id: '2',
      beneficiaryName: 'Papa Henri',
      date: '2024-01-14',
      duration: '12min',
      mood: 'neutral',
      summary: 'Henri semble un peu fatigué mais reste de bonne humeur. Il mentionne des douleurs au dos qui le gênent pour ses promenades quotidiennes. Recommande de consulter son médecin.',
      keywords: ['fatigue', 'dos', 'promenade', 'médecin'],
      healthMentions: ['douleurs dorsales', 'mobilité réduite'],
      concerns: ['douleur persistante']
    },
    {
      id: '3',
      beneficiaryName: 'Tante Sylvie',
      date: '2024-01-13',
      duration: '6min',
      mood: 'negative',
      summary: 'Sylvie n\'a pas répondu aux deux premiers appels. Lors du troisième appel, elle semblait préoccupée et a mentionné des difficultés financières. Conversation écourtée.',
      keywords: ['préoccupée', 'difficultés', 'finances', 'stress'],
      healthMentions: ['stress apparent', 'voix fatiguée'],
      concerns: ['non-réponse répétée', 'préoccupations financières', 'isolement social']
    }
  ];

  const stats = {
    totalCalls: 47,
    averageDuration: '9.2min',
    responseRate: 94,
    positiveRatio: 68,
    concernsCount: 3,
    weeklyTrend: +12
  };

  const periods = [
    { value: 'week', label: 'Cette semaine' },
    { value: 'month', label: 'Ce mois' },
    { value: 'quarter', label: 'Ce trimestre' }
  ];

  const beneficiaries = [
    { value: 'all', label: 'Tous les proches' },
    { value: 'marie', label: 'Grand-mère Marie' },
    { value: 'henri', label: 'Papa Henri' },
    { value: 'sylvie', label: 'Tante Sylvie' }
  ];

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const exportReport = () => {
    // En production, cela génèrerait un PDF
    console.log('Exporting report...');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rapports</Text>
        <TouchableOpacity style={styles.exportButton} onPress={exportReport}>
          <Download size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Filters */}
        <View style={styles.filtersSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Période</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {periods.map((period) => (
                  <TouchableOpacity
                    key={period.value}
                    style={[
                      styles.filterOption,
                      selectedPeriod === period.value && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedPeriod(period.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedPeriod === period.value && styles.filterOptionTextSelected
                    ]}>
                      {period.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Bénéficiaire</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterOptions}>
                {beneficiaries.map((beneficiary) => (
                  <TouchableOpacity
                    key={beneficiary.value}
                    style={[
                      styles.filterOption,
                      selectedBeneficiary === beneficiary.value && styles.filterOptionSelected
                    ]}
                    onPress={() => setSelectedBeneficiary(beneficiary.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedBeneficiary === beneficiary.value && styles.filterOptionTextSelected
                    ]}>
                      {beneficiary.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Statistics Overview */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Vue d'ensemble</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Phone size={20} color="#2563EB" />
              <Text style={styles.statValue}>{stats.totalCalls}</Text>
              <Text style={styles.statLabel}>Appels totaux</Text>
              <View style={styles.statTrend}>
                <TrendingUp size={12} color="#10B981" />
                <Text style={styles.statTrendText}>+{stats.weeklyTrend}%</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <Clock size={20} color="#059669" />
              <Text style={styles.statValue}>{stats.averageDuration}</Text>
              <Text style={styles.statLabel}>Durée moyenne</Text>
            </View>

            <View style={styles.statCard}>
              <BarChart3 size={20} color="#DC2626" />
              <Text style={styles.statValue}>{stats.responseRate}%</Text>
              <Text style={styles.statLabel}>Taux de réponse</Text>
            </View>

            <View style={styles.statCard}>
              <Heart size={20} color="#7C3AED" />
              <Text style={styles.statValue}>{stats.positiveRatio}%</Text>
              <Text style={styles.statLabel}>Humeur positive</Text>
            </View>
          </View>
        </View>

        {/* Alerts Summary */}
        <View style={styles.alertsSection}>
          <Text style={styles.sectionTitle}>Alertes actives</Text>
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle size={20} color="#F59E0B" />
              <Text style={styles.alertTitle}>{stats.concernsCount} préoccupations détectées</Text>
            </View>
            <Text style={styles.alertDescription}>
              Des signaux nécessitent votre attention. Consultez les rapports détaillés ci-dessous.
            </Text>
          </View>
        </View>

        {/* Detailed Reports */}
        <View style={styles.reportsSection}>
          <Text style={styles.sectionTitle}>Rapports détaillés</Text>
          
          {reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportMeta}>
                  <Text style={styles.reportBeneficiary}>{report.beneficiaryName}</Text>
                  <Text style={styles.reportDate}>
                    {new Date(report.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                <View style={styles.reportStats}>
                  <Text style={styles.reportDuration}>{report.duration}</Text>
                  <View style={[
                    styles.moodIndicator,
                    { backgroundColor: getMoodColor(report.mood) }
                  ]} />
                </View>
              </View>

              <Text style={styles.reportSummary}>{report.summary}</Text>

              {report.keywords.length > 0 && (
                <View style={styles.keywordsSection}>
                  <Text style={styles.keywordsTitle}>Mots-clés détectés</Text>
                  <View style={styles.keywordsList}>
                    {report.keywords.map((keyword, index) => (
                      <View key={index} style={styles.keywordTag}>
                        <Text style={styles.keywordText}>{keyword}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {report.healthMentions.length > 0 && (
                <View style={styles.healthSection}>
                  <Text style={styles.healthTitle}>Mentions santé</Text>
                  {report.healthMentions.map((mention, index) => (
                    <Text key={index} style={styles.healthMention}>• {mention}</Text>
                  ))}
                </View>
              )}

              {report.concerns.length > 0 && (
                <View style={styles.concernsSection}>
                  <Text style={styles.concernsTitle}>Préoccupations</Text>
                  {report.concerns.map((concern, index) => (
                    <View key={index} style={styles.concernItem}>
                      <AlertTriangle size={14} color="#F59E0B" />
                      <Text style={styles.concernText}>{concern}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
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
  exportButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterOptionSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterOptionTextSelected: {
    color: '#FFFFFF',
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    minWidth: (width - 52) / 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statTrendText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginLeft: 2,
  },
  alertsSection: {
    padding: 16,
  },
  alertCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 8,
  },
  alertDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
  },
  reportsSection: {
    padding: 16,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  reportMeta: {
    flex: 1,
  },
  reportBeneficiary: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  reportDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  reportStats: {
    alignItems: 'flex-end',
  },
  reportDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 8,
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  reportSummary: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  keywordsSection: {
    marginBottom: 16,
  },
  keywordsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  keywordTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  keywordText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  healthSection: {
    marginBottom: 16,
  },
  healthTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  healthMention: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#059669',
    marginBottom: 4,
  },
  concernsSection: {
    marginBottom: 8,
  },
  concernsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  concernItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  concernText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#DC2626',
    marginLeft: 8,
    flex: 1,
  },
});