import { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { 
  Plus, 
  Phone, 
  Calendar, 
  Settings, 
  Heart, 
  Clock,
  MapPin,
  X,
  Save,
  Play
} from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/services/api';

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  address: string;
  call_schedule: string[];
  emergency_contact: string;
  created_at: string;
}

export default function BeneficiariesScreen() {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    phone: '',
    address: '',
    emergency_contact: ''
  });

  const loadBeneficiaries = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await ApiService.getBeneficiaries(user.id);
      setBeneficiaries(data);
    } catch (error) {
      console.error('Error loading beneficiaries:', error);
      Alert.alert('Erreur', 'Impossible de charger les bénéficiaires');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, [user]);

  const handleAddBeneficiary = async () => {
    if (!newBeneficiary.name || !newBeneficiary.phone) {
      Alert.alert('Erreur', 'Veuillez remplir au moins le nom et le téléphone');
      return;
    }

    try {
      const beneficiary = {
        ...newBeneficiary,
        user_id: user?.id,
        call_schedule: []
      };

      await ApiService.createBeneficiary(beneficiary);
      setNewBeneficiary({ name: '', phone: '', address: '', emergency_contact: '' });
      setShowAddModal(false);
      loadBeneficiaries();
      Alert.alert('Succès', 'Bénéficiaire ajouté avec succès');
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le bénéficiaire');
    }
  };

  const handleInitiateCall = async (beneficiary: Beneficiary) => {
    try {
      Alert.alert(
        'Lancer un appel',
        `Voulez-vous lancer un appel IA à ${beneficiary.name} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Appeler', 
            onPress: async () => {
              try {
                const response = await ApiService.initiateCall({
                  beneficiaryId: beneficiary.id,
                  phoneNumber: beneficiary.phone,
                  name: beneficiary.name
                });
                
                Alert.alert(
                  'Appel lancé',
                  `L'appel IA a été initié pour ${beneficiary.name}. Vous recevrez un résumé une fois l'appel terminé.`
                );
              } catch (error) {
                console.error('Error initiating call:', error);
                Alert.alert('Erreur', 'Impossible de lancer l\'appel');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error:', error);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Proches</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {beneficiaries.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateTitle}>Aucun proche ajouté</Text>
            <Text style={styles.emptyStateText}>
              Commencez par ajouter vos proches pour pouvoir les appeler
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyStateButtonText}>Ajouter un proche</Text>
            </TouchableOpacity>
          </View>
        ) : (
          beneficiaries.map((beneficiary) => (
            <View key={beneficiary.id} style={styles.beneficiaryCard}>
              <View style={styles.cardHeader}>
                <View style={styles.beneficiaryInfo}>
                  <Text style={styles.beneficiaryName}>{beneficiary.name}</Text>
                  <Text style={styles.beneficiaryDate}>
                    Ajouté le {new Date(beneficiary.created_at).toLocaleDateString('fr-FR')}
                  </Text>
                </View>
              </View>

              <View style={styles.contactInfo}>
                <View style={styles.infoRow}>
                  <Phone size={16} color="#6B7280" />
                  <Text style={styles.infoText}>{beneficiary.phone}</Text>
                </View>
                {beneficiary.address && (
                  <View style={styles.infoRow}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.infoText}>{beneficiary.address}</Text>
                  </View>
                )}
              </View>

              {beneficiary.emergency_contact && (
                <View style={styles.emergencySection}>
                  <Text style={styles.emergencyTitle}>Contact d'urgence</Text>
                  <Text style={styles.emergencyContact}>{beneficiary.emergency_contact}</Text>
                </View>
              )}

              <View style={styles.scheduleSection}>
                <Text style={styles.scheduleTitle}>Horaires d'appel</Text>
                <View style={styles.scheduleList}>
                  {beneficiary.call_schedule && beneficiary.call_schedule.length > 0 ? (
                    beneficiary.call_schedule.map((schedule, index) => (
                      <View key={index} style={styles.scheduleItem}>
                        <Calendar size={12} color="#2563EB" />
                        <Text style={styles.scheduleText}>{schedule}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noScheduleText}>Aucun horaire configuré</Text>
                  )}
                </View>
              </View>

              <View style={styles.cardActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleInitiateCall(beneficiary)}
                >
                  <Play size={16} color="#2563EB" />
                  <Text style={styles.actionText}>Appeler maintenant</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Calendar size={16} color="#2563EB" />
                  <Text style={styles.actionText}>Planifier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Settings size={16} color="#2563EB" />
                  <Text style={styles.actionText}>Paramètres</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Beneficiary Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajouter un proche</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nom complet *</Text>
              <TextInput
                style={styles.input}
                value={newBeneficiary.name}
                onChangeText={(text) => setNewBeneficiary({...newBeneficiary, name: text})}
                placeholder="Nom et prénom"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Téléphone *</Text>
              <TextInput
                style={styles.input}
                value={newBeneficiary.phone}
                onChangeText={(text) => setNewBeneficiary({...newBeneficiary, phone: text})}
                placeholder="01 23 45 67 89"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Adresse</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newBeneficiary.address}
                onChangeText={(text) => setNewBeneficiary({...newBeneficiary, address: text})}
                placeholder="Adresse complète"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contact d'urgence</Text>
              <TextInput
                style={styles.input}
                value={newBeneficiary.emergency_contact}
                onChangeText={(text) => setNewBeneficiary({...newBeneficiary, emergency_contact: text})}
                placeholder="Dr. Martin - 01 23 45 67 90"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddBeneficiary}
            >
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
  addButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 6,
  },
  beneficiaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  beneficiaryInfo: {
    flex: 1,
  },
  beneficiaryName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  beneficiaryDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  contactInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
  },
  emergencySection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  emergencyTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    marginBottom: 4,
  },
  emergencyContact: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
  },
  scheduleSection: {
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  scheduleList: {
    gap: 6,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scheduleText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#2563EB',
    marginLeft: 6,
  },
  noScheduleText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 6,
  },
});