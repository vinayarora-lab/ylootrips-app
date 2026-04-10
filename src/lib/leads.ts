/**
 * Lead tracking: ticket generation + Google Sheets logging
 * Sheet: https://docs.google.com/spreadsheets/d/1GkBPp4YNjZYeTRRZN0ugVTZUNTaVAH2Mmfti9jr1PmE
 */

import { google } from 'googleapis';

const SHEET_ID = '1GkBPp4YNjZYeTRRZN0ugVTZUNTaVAH2Mmfti9jr1PmE';
const SHEET_NAME = 'Leads'; // Tab name in the spreadsheet

export interface LeadData {
  ticket: string;
  type: 'Market Inquiry' | 'Contact Form' | 'Hotel Booking' | 'Flight Booking' | 'Trip Planner';
  name: string;
  email: string;
  phone: string;
  destination: string;
  packageName?: string;
  price?: string;
  guests?: string;
  notes?: string;
}

/** Generates ticket like YLO-20260410-4821 */
export function generateTicket(): string {
  const date = new Date();
  const ymd = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `YLO-${ymd}-${rand}`;
}

/** Appends a lead row to Google Sheet. Non-fatal — never throws. */
export async function logLeadToSheet(lead: LeadData): Promise<void> {
  try {
    const credJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!credJson) return; // silently skip if not configured

    const creds = JSON.parse(credJson);
    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const now = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:K`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          lead.ticket,
          now,
          lead.type,
          lead.name,
          lead.email,
          lead.phone,
          lead.destination,
          lead.packageName || '',
          lead.price || '',
          lead.guests || '',
          lead.notes || '',
          'New', // Status column
        ]],
      },
    });
  } catch (err) {
    // Non-fatal — log but don't break the flow
    console.error('[leads] Failed to log to Google Sheet:', err);
  }
}
