import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { Users, Search, Filter, Plus, MoveVertical as MoreVertical, CreditCard as Edit, Trash2, Shield, Building2, User, Mail, Phone, Calendar, X, Save } from 'lucide-react-native';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'family' | 'municipality' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  subscriptionStatus: 'active' | 'expired' | 'trial';
  createdAt: string;
  lastLogin: string;
  beneficiariesCount?: number;
  municipalityName?: string;
}

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Mock data
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      role: 'family',
      status: 'active',
      subscriptionStatus: 'active',
      createdAt: '2024-01-15',
      lastLogin: 'Aujourd\'hui, 14h30',
      beneficiariesCount: 2
    },
    {
      id: '2',
      name: 'Mairie de Paris 15e',
      email: 'contact@mairie15.paris.fr',
      role: 'municipality',
      status: 'active',
      subscriptionStatus: 'active',
      createdAt: '2024-01-10',
      lastLogin: 'Hier, 16h45',
      municipalityName: 'Paris 15e',
      beneficiariesCount: 150
    },
    {
      id: '3',
      name: 'Jean Martin',
      email: 'jean.martin@email.com',
      role: 'family',
      status: 'inactive',
      subscriptionStatus: 'expired',
      createdAt: '2024-01-05',
      lastLogin: 'Il y a 3 jours',
      beneficiariesCount: 1
    },
    {
      id: '4',
      name: 'Admin Vocalys',
      email: 'admin@vocalyscare.fr',
      role: 'admin',
      status: 'active',
      subscriptionStatus: 'active',
      createdAt: '2024-01-01',
      lastLogin: 'Aujourd\'hui, 09h15'
    }
  ]);

  const filters = [
    { value: 'all', label: 'Tous', count: users.length },
    { value: 'family', label: 'Familles', count: users.filter(u => u.role === 'family').length },
    { value: 'municipality', label: 'Collectivités', count: users.filter(u => u.role === 'municipality').length },
    { value: 'admin', label: 'Admins', count: users.filter(u => u.role === 'admin').length },
    { value: 'active', label: 'Actifs', count: users.filter(u => u.status === 'active').length },
    { value: 'inactive', label: 'Inactifs', count: users.filter(u => u.status === 'inactive').length }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'active' || selectedFilter === 'inactive') {
      return matchesSearch && user.status === selectedFilter;
    }
    return matchesSearch && user.role === selectedFilter;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Shield;
      case 'municipality': return Building2;
      default: return User;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#DC2626';
      case 'municipality': return '#2563EB';
      default: return '#059669';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981';
      case 'suspended': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const handleUserAction = (action: string, user: UserData) => {
    switch (action) {
      case 'edit':
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      case 'suspend':
        Alert.alert(
          'Suspendre l\'utilisateur',
          `Êtes-vous sûr de vouloir suspendre ${user.name} ?`,
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Suspendre', style: 'destructive', onPress: () => {
              setUsers(users.map(u => u.id === user.id ? {...u, status: 'suspended'} : u));
            }}
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Supprimer l\'utilisateur',
          `Êtes-vous sûr de vouloir supprimer ${user.name} ? Cette action est irréversible.`,
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Supprimer', style: 'destructive', onPress: () => {
              setUsers(users.filter(u => u.id !== user.id));
            }}
          ]
        );
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des utilisateurs</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un utilisateur..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
        <View style={styles.filters}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterChip,
                selectedFilter === filter.value && styles.filterChipSelected
              ]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter.value && styles.filterTextSelected
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Users List */}
      <ScrollView style={styles.content}>
        {filteredUsers.map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  <View style={[styles.roleIcon, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                    <RoleIcon size={20} color={getRoleColor(user.role)} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.moreButton}
                  onPress={() => {
                    Alert.alert(
                      'Actions',
                      'Que souhaitez-vous faire ?',
                      [
                        { text: 'Modifier', onPress: () => handleUserAction('edit', user) },
                        { text: 'Suspendre', onPress: () => handleUserAction('suspend', user) },
                        { text: 'Supprimer', style: 'destructive', onPress: () => handleUserAction('delete', user) },
                        { text: 'Annuler', style: 'cancel' }
                      ]
                    );
                  }}
                >
                  <MoreVertical size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.userMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Statut</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) }]}>
                    <Text style={styles.statusText}>
                      {user.status === 'active' ? 'Actif' : 
                       user.status === 'suspended' ? 'Suspendu' : 'Inactif'}
                    </Text>
                  </View>
                </View>

                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Abonnement</Text>
                  <Text style={[
                    styles.metaValue,
                    { color: user.subscriptionStatus === 'active' ? '#10B981' : '#F59E0B' }
                  ]}>
                    {user.subscriptionStatus === 'active' ? 'Actif' : 
                     user.subscriptionStatus === 'trial' ? 'Essai' : 'Expiré'}
                  </Text>
                </View>

                {user.beneficiariesCount !== undefined && (
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Bénéficiaires</Text>
                    <Text style={styles.metaValue}>{user.beneficiariesCount}</Text>
                  </View>
                )}
              </View>

              <View style={styles.userFooter}>
                <Text style={styles.footerText}>
                  Inscrit le {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </Text>
                <Text style={styles.footerText}>
                  Dernière connexion: {user.lastLogin}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add User Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Ajouter un utilisateur</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Fonctionnalité en cours de développement
            </Text>
          </View>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        visible={showUserModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modifier l'utilisateur</Text>
            <TouchableOpacity onPress={() => setShowUserModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Fonctionnalité en cours de développement
            </Text>
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
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userCard: {
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
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  moreButton: {
    padding: 8,
  },
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  userFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginBottom: 2,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});