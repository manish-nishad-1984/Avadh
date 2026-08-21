import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';
import { config } from '../config';

export class AuthService {
  static async login(email: string, password: string) {
    const result = await query('SELECT id, name, email, password_hash, role, is_active FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const user = result.rows[0];
    if (!user.is_active) {
      throw { statusCode: 403, message: 'Account is deactivated' };
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw { statusCode: 401, message: 'Invalid email or password' };
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as any,
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  static async getMe(userId: string) {
    const result = await query('SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      throw { statusCode: 404, message: 'User not found' };
    }
    return result.rows[0];
  }
}
