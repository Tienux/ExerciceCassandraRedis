import { Injectable } from '@nestjs/common';
import { Client } from 'cassandra-driver';
import { createClient } from 'redis';

@Injectable()
export class AppService {
  private cassandraClient: Client;
  private redisClient;

  constructor() {
    // Initialisation de Cassandra
    this.cassandraClient = new Client({
      contactPoints: ['127.0.0.1'],
      localDataCenter: 'datacenter1',
      keyspace: 'projet_web',
    });

    // Initialisation de Redis
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  // Méthodes Cassandra de base
  async getHello(): Promise<string> {
    return 'Hello World!';
  }

  // Voici un exemple de méthode pour récupérer tous les produits
  async getAllProducts(): Promise<any> {
    const query = 'SELECT * FROM products LIMIT 50';
    const result = await this.cassandraClient.execute(query);
    return result.rows;
  }

  // Voici un exemple de méthode pour récupérer un produit par son ID
  // le prepare: true est nécessaire pour les requêtes paramétrées
  async getProduct(productId: string): Promise<any> {
    const query = 'SELECT * FROM products WHERE id = ?';
    const result = await this.cassandraClient.execute(query, [productId], { prepare: true });
    return result.rows;
  }
  
  //Completer le code pour retourner toutes les catégories
  async getAllCategories(): Promise<any> {
    return 'Affichage catégorie';
  }

  //Completer le code pour retourner une catégorie par son ID
  //Il manque peut etre un paramètre
  //Attention a modifier dans le app.controller.ts
  async getCategory(): Promise<any> {
    return "Affiche catégorie";
  }


  //Compléter le code pour retourner tous les utilisateurs
  async getAllUsers(): Promise<any[]> {
    //TODO: Retourner tous les utilisateurs
    return ['Affiche tout les utilisateurs'];
  }
  
  //Compléter le code pour retourner un utilisateur par son ID
  //N'oubliez pas le app.controller.ts
  async getUser(): Promise<any> {
    return 'Affiche user';
  }
  
  //Compléter le code pour créer un utilisateur
  // Vous aurez besoins de deux paramètres
  //Attention aux id deja existante.
  async createUser(): Promise<any> {
    return 'Création utilisateur';
  }
  
  //Voici l'exemple du delte. Observez bien comment le panier est supprimé
  async deleteUser(userId: string): Promise<any> {
    const userQuery = 'SELECT id, idpanier FROM users WHERE id = ?';
    const userResult = await this.cassandraClient.execute(userQuery, [userId]);

    if (userResult.rowLength === 0) {
      throw new Error(`user ${userId} not found`);
    }

    const deleteQuery = 'DELETE FROM users WHERE id = ?';
    await this.cassandraClient.execute(deleteQuery, [userId], { prepare: true });

    const cartId = userResult.rows[0].idpanier;
    await this.redisClient.del(`cart:${cartId}`);

    return { message: `user ${userId} deleted` };
  }


  //Compléter le code pour authentifier un utilisateur
  //Renvoyez null si l'utilisateur n'existe pas ou que le mot de passe est incorrect
  //Renvoyez le user.id et user.name si l'authentification réussie
  async authenticateUser(username: string, password: string): Promise<any> {
    //TODO Logique d'authentification
    // Retourner les informations de l'utilisateur si l'authentification réussie
    return {id:"a completer", name:"a completer"};
  }


  //Passons à la partie REDIS
  //Voici un exemple de méthode pour ajouter un produit au panier d'un utilisateur
  async setProductToCart(userId: string, productId: string, quantity: number): Promise<any> {
    const cartKey = `cart:${userId}`;
    await this.redisClient.hSet(cartKey, productId, quantity);
  }

  //Completer le code pour retirer un produit du panier d'un utilisateur
  //Vous avez besoins de deux paramètres
  //Pensez au app.controller.ts
  async removeProductFromCart(): Promise<any> {
    //TODO: Retirer un produit du panier
  }


  //Completer le code pour retourner le panier d'un utilisateur
  async getCart(userId: string): Promise<any[]> {
  return [ "Affiche panier "];
  }

  //Completer le code pour supprimer le panier d'un utilisateur
  //Besoins d'un paramètre
  async clearCart(): Promise<any> {
    //TODO Supprimer le panier de l'utilisateur
    return "Panier supprimé";
  }
  //Une fois ces méthodes faites, retourner sur la fiche TD pour la suite
  

}
