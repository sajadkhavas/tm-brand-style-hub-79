/**
 * Contact API - Send contact form to backend
 * Note: Paths do NOT include /api prefix as VITE_API_URL already includes it
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
    // Note: NO /api prefix - VITE_API_URL already includes it
    await apiClient.post('/contact', data);
    return true;
  } catch (error) {
    console.error('Failed to submit contact form:', error);
    return false;
  }
};
