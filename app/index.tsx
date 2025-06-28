import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Users, Shield, ChartBar as BarChart3, Phone, MessageCircle, Clock, CircleCheck as CheckCircle, Star, ArrowRight, Play } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const features = [
    {
      icon: Phone,
      title: 'Appels IA Bienveillants',
      description: 'Notre intelligence artificielle appelle vos proches avec empathie et naturel',
      color: '#2563EB'
    },
    {
      icon: Heart,
      title: 'Détection Précoce',
      description: 'Identification automatique des signaux de détresse ou d\'isolement',
      color: '#DC2626'
    },
    {
      icon: BarChart3,
      title: 'Rapports Personnalisés',
      description: 'Suivez l\'évolution du bien-être avec des analyses détaillées',
      color: '#059669'
    },
    {
      icon: Shield,
      title: 'Sécurité Maximale',
      description: 'Données chiffrées, conformité RGPD et respect de la vie privée',
      color: '#7C3AED'
    }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Fille de bénéficiaire',
      content: 'Grâce à Vocalys Care, je suis rassurée. Maman reçoit des appels réguliers et je suis alertée en cas de problème.',
      rating: 5
    },
    {
      name: 'Mairie de Versailles',
      role: 'Service social',
      content: 'Un outil formidable pour notre plan canicule. Nous suivons 200+ seniors avec une efficacité remarquable.',
      rating: 5
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Appels quotidiens' },
    { value: '98%', label: 'Satisfaction' },
    { value: '24/7', label: 'Disponibilité' },
    { value: '2min', label: 'Temps de réponse' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#1E40AF', '#2563EB', '#3B82F6']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Heart size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.logo}>Vocalys Care</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            L'IA qui prend soin{'\n'}de vos proches
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Une solution innovante qui maintient le lien social avec les seniors grâce à des appels IA bienveillants et une surveillance intelligente.
          </Text>

          <View style={styles.heroButtons}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.primaryButtonText}>Essai gratuit 14 jours</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {/* Demo video */}}
            >
              <Play size={16} color="#FFFFFF" />
              <Text style={styles.secondaryButtonText}>Voir la démo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <Shield size={16} color="#C7D2FE" />
              <Text style={styles.trustText}>Conforme RGPD</Text>
            </View>
            <View style={styles.trustItem}>
              <CheckCircle size={16} color="#C7D2FE" />
              <Text style={styles.trustText}>Données en France</Text>
            </View>
            <View style={styles.trustItem}>
              <Heart size={16} color="#C7D2FE" />
              <Text style={styles.trustText}>Support 24/7</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Une technologie au service de l'humain</Text>
          <Text style={styles.sectionSubtitle}>
            Découvrez comment Vocalys Care révolutionne l'accompagnement des seniors
          </Text>
        </View>
        
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color + '15' }]}>
                <feature.icon size={28} color={feature.color} />
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* How it works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comment ça marche ?</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Configurez les appels</Text>
              <Text style={styles.stepDescription}>
                Définissez les horaires, la fréquence et les préférences pour chaque proche
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>L'IA appelle automatiquement</Text>
              <Text style={styles.stepDescription}>
                Notre IA conversationnelle engage des discussions naturelles et bienveillantes
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Recevez les rapports</Text>
              <Text style={styles.stepDescription}>
                Consultez les résumés détaillés et soyez alerté en cas de préoccupation
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Testimonials */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>Ils nous font confiance</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsScroll}>
          {testimonials.map((testimonial, index) => (
            <View key={index} style={styles.testimonialCard}>
              <View style={styles.testimonialRating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
                ))}
              </View>
              <Text style={styles.testimonialContent}>"{testimonial.content}"</Text>
              <View style={styles.testimonialAuthor}>
                <Text style={styles.testimonialName}>{testimonial.name}</Text>
                <Text style={styles.testimonialRole}>{testimonial.role}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Pricing Preview */}
      <View style={styles.pricingSection}>
        <Text style={styles.sectionTitle}>Tarification simple et transparente</Text>
        <View style={styles.pricingCards}>
          <View style={styles.pricingCard}>
            <Text style={styles.pricingType}>Famille</Text>
            <View style={styles.pricingPrice}>
              <Text style={styles.pricingAmount}>29€</Text>
              <Text style={styles.pricingPeriod}>/mois</Text>
            </View>
            <Text style={styles.pricingDescription}>Jusqu'à 3 bénéficiaires</Text>
            <View style={styles.pricingFeatures}>
              <View style={styles.pricingFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.pricingFeatureText}>Appels illimités</Text>
              </View>
              <View style={styles.pricingFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.pricingFeatureText}>Rapports détaillés</Text>
              </View>
              <View style={styles.pricingFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.pricingFeatureText}>Alertes en temps réel</Text>
              </View>
            </View>
          </View>

          <View style={[styles.pricingCard, styles.pricingCardPopular]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>Populaire</Text>
            </View>
            <Text style={styles.pricingType}>Collectivité</Text>
            <View style={styles.pricingPrice}>
              <Text style={styles.pricingAmount}>Sur mesure</Text>
            </View>
            <Text style={styles.pricingDescription}>Solution personnalisée</Text>
            <View style={styles.pricingFeatures}>
              <View style={styles.pricingFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.pricingFeatureText}>Bénéficiaires illimités</Text>
              </View>
              <View style={styles.pricingFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.pricingFeatureText}>Dashboard avancé</Text>
              </View>
              <View style={styles.pricingFeature}>
                <CheckCircle size={16} color="#10B981" />
                <Text style={styles.pricingFeatureText}>Support prioritaire</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <LinearGradient
          colors={['#F8FAFC', '#EFF6FF']}
          style={styles.ctaContainer}
        >
          <Text style={styles.ctaTitle}>Prêt à commencer ?</Text>
          <Text style={styles.ctaSubtitle}>
            Rejoignez des milliers de familles qui font confiance à Vocalys Care
          </Text>
          
          <View style={styles.ctaButtons}>
            <TouchableOpacity
              style={styles.ctaPrimaryButton}
              onPress={() => router.push('/auth')}
            >
              <Text style={styles.ctaPrimaryButtonText}>Commencer l'essai gratuit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.ctaSecondaryButton}
              onPress={() => router.push('/auth?mode=login')}
            >
              <Text style={styles.ctaSecondaryButtonText}>Se connecter</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.ctaNote}>
            ✓ Aucune carte bancaire requise • ✓ Annulation à tout moment
          </Text>
        </LinearGradient>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Vocalys Technologies • Conforme RGPD • Données hébergées en France
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 24,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  heroTitle: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#C7D2FE',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  heroButtons: {
    width: '100%',
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#2563EB',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 24,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#C7D2FE',
    marginLeft: 6,
  },
  statsSection: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  section: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  featuresGrid: {
    gap: 24,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  stepsContainer: {
    gap: 32,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  testimonialsSection: {
    paddingVertical: 48,
    backgroundColor: '#F8FAFC',
  },
  testimonialsScroll: {
    paddingLeft: 24,
  },
  testimonialCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    marginRight: 16,
    width: width * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  testimonialRating: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  testimonialContent: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  testimonialAuthor: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  testimonialName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  testimonialRole: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  pricingSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  pricingCards: {
    gap: 16,
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  pricingCardPopular: {
    borderColor: '#2563EB',
    transform: [{ scale: 1.02 }],
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 24,
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  pricingType: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  pricingPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  pricingAmount: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#2563EB',
  },
  pricingPeriod: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  pricingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
  },
  pricingFeatures: {
    gap: 8,
  },
  pricingFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pricingFeatureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    marginLeft: 8,
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  ctaContainer: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  ctaButtons: {
    width: '100%',
    marginBottom: 24,
  },
  ctaPrimaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
  },
  ctaPrimaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  ctaSecondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  ctaSecondaryButtonText: {
    color: '#4B5563',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  ctaNote: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});