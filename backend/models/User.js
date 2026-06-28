const store = require('./store');
const bcrypt = require('bcryptjs');

class UserQuery {
  constructor(user) {
    this.user = user;
  }

  /**
   * Mock field selector (e.g. removing password field)
   */
  select(fields) {
    if (this.user) {
      // Create a shallow copy to prevent modifying the database store reference
      this.user = { ...this.user };
      if (fields.includes('-password')) {
        delete this.user.password;
      }
    }
    return this;
  }

  /**
   * Thenable interface to allow direct awaiting
   */
  then(resolve, reject) {
    resolve(this.user);
  }
}

class User {
  /**
   * Mock search for single user
   */
  static findOne(query) {
    if (!query) return new UserQuery(null);

    let user = null;

    if (query.email) {
      const emailVal = query.email.toLowerCase();
      user = store.users.find((u) => u.email === emailVal);
    } else if (query.username) {
      user = store.users.find((u) => u.username === query.username);
    } else if (query.$or) {
      const emailQuery = query.$or.find((q) => q.email);
      const usernameQuery = query.$or.find((q) => q.username);

      const emailVal = emailQuery ? (typeof emailQuery.email === 'string' ? emailQuery.email.toLowerCase() : emailQuery.email) : null;
      const usernameVal = usernameQuery ? usernameQuery.username : null;

      user = store.users.find(
        (u) => (emailVal && u.email === emailVal) || (usernameVal && u.username === usernameVal)
      );
    }

    return new UserQuery(user ? this.wrap(user) : null);
  }

  /**
   * Mock search by ID
   */
  static findById(id) {
    if (!id) return new UserQuery(null);
    const user = store.users.find((u) => u._id === id.toString());
    return new UserQuery(user ? this.wrap(user) : null);
  }

  /**
   * Mock user registration creation
   */
  static async create(data) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    
    const newUser = {
      _id: Math.random().toString(36).substring(2, 9),
      username: data.username,
      email: data.email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    store.users.push(newUser);
    return this.wrap(newUser);
  }

  /**
   * Wrap raw Javascript user object with mongoose-compatible helper methods
   */
  static wrap(user) {
    return {
      ...user,
      comparePassword: async function (enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
      },
    };
  }
}

module.exports = User;
