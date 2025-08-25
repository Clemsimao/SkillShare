// tests/services/conversationService.test.js
import { conversationService } from '../../services/conversationService.js';
import { testDb } from '../setUp/testDb.js';
import { Conversation } from '../../models/index.js';

describe('conversationService', () => {
  // Nettoyer les conversations entre chaque test pour indépendance
  beforeEach(async () => {
    await testDb.cleanBetweenTests();
  });

  describe('createOrGetConversation', () => {
    test('doit créer une nouvelle conversation entre deux utilisateurs', async () => {
      // ARRANGE - Utiliser les helpers testDb
      const miyamotoId = testDb.users.miyamoto.id;
      const gatesId = testDb.users.gates.id;

      // ACT - Exécuter l'action
      const result = await conversationService.createOrGetConversation(miyamotoId, gatesId);

      // ASSERT - Vérifier le résultat
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.participants).toHaveLength(2);
      expect(result.createdAt).toBeDefined();
      expect(result.lastMessageAt).toBeDefined();

      // Vérifier que les participants sont bien présents
      const participantIds = result.participants.map(p => p.id);
      expect(participantIds).toContain(miyamotoId);
      expect(participantIds).toContain(gatesId);
    });

    test('doit forcer ordre user1_id < user2_id (logique Math.min/max)', async () => {
      // ARRANGE - Inverser l'ordre volontairement
      const miyamotoId = testDb.users.miyamoto.id; // Plus petit ID
      const gatesId = testDb.users.gates.id;       // Plus grand ID

      // ACT - Créer avec Gates en premier (ordre inversé)
      const result = await conversationService.createOrGetConversation(gatesId, miyamotoId);

      // ASSERT - Vérifier que l'ordre est forcé en DB
      const conversationInDb = await Conversation.findByPk(result.id);
      expect(conversationInDb.user1_id).toBe(miyamotoId); // Plus petit ID = user1
      expect(conversationInDb.user2_id).toBe(gatesId);    // Plus grand ID = user2
    });

    test('doit récupérer conversation existante sans créer de doublon', async () => {
      // ARRANGE - Créer une première conversation
      const miyamotoId = testDb.users.miyamoto.id;
      const gatesId = testDb.users.gates.id;
      
      const firstCall = await conversationService.createOrGetConversation(miyamotoId, gatesId);
      
      // ACT - Essayer de créer la même conversation (ordre inversé)
      const secondCall = await conversationService.createOrGetConversation(gatesId, miyamotoId);

      // ASSERT - Doit retourner la même conversation
      expect(firstCall.id).toBe(secondCall.id);
      
      // Vérifier qu'il n'y a qu'une seule conversation en DB
      const conversationCount = await Conversation.count();
      expect(conversationCount).toBe(1);
    });

    test('doit lever erreur si utilisateur inexistant', async () => {
      // ARRANGE - Utiliser un ID inexistant
      const miyamotoId = testDb.users.miyamoto.id; // Existe
      const fakeUserId = 999;                      // N'existe pas

      // ACT & ASSERT - Doit lever une erreur
      await expect(
        conversationService.createOrGetConversation(miyamotoId, fakeUserId)
      ).rejects.toThrow('Un ou plusieurs utilisateurs n\'existent pas');
    });

    test('doit lever erreur pour auto-conversation (même utilisateur)', async () => {
      // ARRANGE - Même utilisateur
      const miyamotoId = testDb.users.miyamoto.id;

      // ACT & ASSERT - Doit lever une erreur
      await expect(
        conversationService.createOrGetConversation(miyamotoId, miyamotoId)
      ).rejects.toThrow('Un utilisateur ne peut pas créer une conversation avec lui-même');
    });

    test('doit lever erreur si paramètres manquants', async () => {
      // ACT & ASSERT - Tester différents cas de paramètres manquants
      await expect(
        conversationService.createOrGetConversation(null, testDb.users.gates.id)
      ).rejects.toThrow('Les IDs des utilisateurs sont requis');

      await expect(
        conversationService.createOrGetConversation(testDb.users.miyamoto.id, null)
      ).rejects.toThrow('Les IDs des utilisateurs sont requis');

      await expect(
        conversationService.createOrGetConversation()
      ).rejects.toThrow('Les IDs des utilisateurs sont requis');
    });
  });

  describe('getConversationsByUser', () => {
    test('doit retourner liste vide si utilisateur sans conversations', async () => {
      // ARRANGE - Utilisateur sans conversations
      const miyamotoId = testDb.users.miyamoto.id;

      // ACT
      const result = await conversationService.getConversationsByUser(miyamotoId);

      // ASSERT
      expect(result).toEqual([]);
    });

    test('doit retourner conversations avec otherParticipant correct', async () => {
      // ARRANGE - Créer conversations avec Miyamoto
      const miyamotoId = testDb.users.miyamoto.id;
      const gatesId = testDb.users.gates.id;
      const nadellaId = testDb.users.nadella.id;

      // Créer 2 conversations
      await conversationService.createOrGetConversation(miyamotoId, gatesId);
      await conversationService.createOrGetConversation(miyamotoId, nadellaId);

      // ACT
      const result = await conversationService.getConversationsByUser(miyamotoId);

      // ASSERT
      expect(result).toHaveLength(2);
      
      // Vérifier que otherParticipant n'est jamais Miyamoto lui-même
      const otherParticipantIds = result.map(conv => conv.otherParticipant.id);
      expect(otherParticipantIds).not.toContain(miyamotoId);
      expect(otherParticipantIds).toContain(gatesId);
      expect(otherParticipantIds).toContain(nadellaId);

      // Vérifier structure des données
      const firstConv = result[0];
      expect(firstConv).toHaveProperty('id');
      expect(firstConv).toHaveProperty('createdAt');
      expect(firstConv).toHaveProperty('lastMessageAt');
      expect(firstConv.otherParticipant).toHaveProperty('firstName');
      expect(firstConv.otherParticipant).toHaveProperty('lastName');
      expect(firstConv.otherParticipant).toHaveProperty('username');
    });

    test('doit trier par activité récente (last_message_at DESC)', async () => {
      // ARRANGE - Créer conversations avec timestamps différents
      const miyamotoId = testDb.users.miyamoto.id;
      const gatesId = testDb.users.gates.id;
      const nadellaId = testDb.users.nadella.id;

      // Créer première conversation
      const conv1 = await conversationService.createOrGetConversation(miyamotoId, gatesId);
      
      // Attendre 10ms pour différencier les timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Créer deuxième conversation (plus récente)
      const conv2 = await conversationService.createOrGetConversation(miyamotoId, nadellaId);

      // Mettre à jour conv1 pour la rendre plus récente
      await conversationService.updateLastMessageAt(conv1.id);

      // ACT
      const result = await conversationService.getConversationsByUser(miyamotoId);

      // ASSERT - La conversation 1 (mise à jour) doit être en premier
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(conv1.id); // Plus récente en premier
      expect(result[1].id).toBe(conv2.id);
    });

    test('doit lever erreur si userId manquant', async () => {
      // ACT & ASSERT
      await expect(
        conversationService.getConversationsByUser()
      ).rejects.toThrow('L\'ID utilisateur est requis');

      await expect(
        conversationService.getConversationsByUser(null)
      ).rejects.toThrow('L\'ID utilisateur est requis');
    });
  });

  describe('updateLastMessageAt', () => {
    test('doit mettre à jour le timestamp last_message_at', async () => {
      // ARRANGE - Créer une conversation
      const conversation = await conversationService.createOrGetConversation(
        testDb.users.miyamoto.id, 
        testDb.users.gates.id
      );
      const originalTimestamp = conversation.lastMessageAt;

      // Attendre pour avoir une différence mesurable
      await new Promise(resolve => setTimeout(resolve, 10));

      // ACT
      const result = await conversationService.updateLastMessageAt(conversation.id);

      // ASSERT
      expect(result).toBe(true);
      
      // Vérifier que le timestamp a bien été mis à jour
      const updatedConv = await Conversation.findByPk(conversation.id);
      expect(updatedConv.last_message_at.getTime()).toBeGreaterThan(
        originalTimestamp.getTime()
      );
    });

    test('doit lever erreur si conversation inexistante', async () => {
      // ARRANGE - ID inexistant
      const fakeConversationId = 999;

      // ACT & ASSERT
      await expect(
        conversationService.updateLastMessageAt(fakeConversationId)
      ).rejects.toThrow('Conversation non trouvée');
    });

    test('doit lever erreur si conversationId manquant', async () => {
      // ACT & ASSERT
      await expect(
        conversationService.updateLastMessageAt()
      ).rejects.toThrow('L\'ID de conversation est requis');

      await expect(
        conversationService.updateLastMessageAt(null)
      ).rejects.toThrow('L\'ID de conversation est requis');
    });
  });

  describe('getConversationWithParticipants (helper method)', () => {
    test('doit retourner conversation avec participants complets', async () => {
      // ARRANGE
      const conversation = await conversationService.createOrGetConversation(
        testDb.users.miyamoto.id, 
        testDb.users.gates.id
      );

      // ACT
      const result = await conversationService.getConversationWithParticipants(conversation.id);

      // ASSERT
      expect(result).toBeDefined();
      expect(result.id).toBe(conversation.id);
      expect(result.participants).toHaveLength(2);
      
      // Vérifier structure complète des participants
      const participant1 = result.participants[0];
      expect(participant1).toHaveProperty('id');
      expect(participant1).toHaveProperty('firstName');
      expect(participant1).toHaveProperty('lastName');
      expect(participant1).toHaveProperty('username');
      expect(participant1).toHaveProperty('profilePicture');
      
      // Vérifier que password n'est pas exposé
      expect(participant1).not.toHaveProperty('password');
    });

    test('doit lever erreur si conversation inexistante', async () => {
      // ACT & ASSERT
      await expect(
        conversationService.getConversationWithParticipants(999)
      ).rejects.toThrow('Conversation non trouvée');
    });
  });
});