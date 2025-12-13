/**
 * Contact API - Send contact form to backend
 */
import { apiClient } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Submit contact form
 */
export const submitContactForm = async (data: ContactFormData): Promise<boolean> => {
  try {
    await apiClient.post('/api/contact', data);
    return true;
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return false;
  }
};
