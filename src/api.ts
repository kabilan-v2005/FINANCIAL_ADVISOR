const API_BASE = 'http://localhost:5000';

/* ===========================
   AUTHENTICATION APIs
=========================== */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

/**
 * Register a new user
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Registration failed' }));
    throw new Error(errorBody.error || 'Registration failed');
  }

  return response.json();
}

/**
 * Login user with email and password
 */
export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(errorBody.error || 'Invalid credentials');
  }

  return response.json();
}

/* ===========================
   PROTECTED APIs (require token)
=========================== */

/**
 * Analyze a bank statement (requires authentication)
 */
export async function analyzeStatement(
  prompt: string,
  token: string,
  fileName?: string
): Promise<string> {
  const response = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, fileName: fileName || 'statement' }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please login again');
    }
    const errorBody = await response.json().catch(() => ({ error: 'Analysis failed' }));
    throw new Error(errorBody.error || `Server error ${response.status}`);
  }

  const data = await response.json();
  return data.result ?? data.text ?? '';
}

/**
 * Get user's statement history (requires authentication)
 */
export async function getHistory(token: string): Promise<any[]> {
  const response = await fetch(`${API_BASE}/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please login again');
    }
    const errorBody = await response.json().catch(() => ({ error: 'Failed to fetch history' }));
    throw new Error(errorBody.error || 'Failed to fetch history');
  }

  const data = await response.json();
  return data.statements ?? [];
}

/**
 * Get a specific statement by ID (requires authentication)
 */
export async function getStatement(statementId: string, token: string): Promise<any> {
  const response = await fetch(`${API_BASE}/history/${statementId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please login again');
    }
    const errorBody = await response.json().catch(() => ({ error: 'Statement not found' }));
    throw new Error(errorBody.error || 'Statement not found');
  }

  const data = await response.json();
  return data.statement;
}

/**
 * Chat with AI (requires authentication)
 */
export async function chatWithAI(
  message: string,
  history: any[],
  token: string
): Promise<string> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message, history }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized: Please login again');
    }
    const errorBody = await response.json().catch(() => ({ error: 'Chat failed' }));
    throw new Error(errorBody.error || 'Chat failed');
  }

  const data = await response.json();
  return data.reply ?? '';
}
