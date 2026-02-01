
import { STRATEGY_FILES } from '../constants/strategyFiles';

/**
 * EMAILJS CONFIGURATION - ALGOBROS AI
 * Service: service_0owc3xi
 * Template: template_2018kch
 * Public Key: Z-yrYA7OfOb1dhiHc
 */

export const sendStrategyEmail = async (userEmail: string, fullName: string) => {
  const cleanEmail = (userEmail || "").trim().toLowerCase();
  const cleanName = (fullName || "Premium Trader").trim();
  
  if (!cleanEmail) {
    console.error("❌ Email manquant pour l'envoi des stratégies");
    return false;
  }

  console.log(`📧 Tentative d'envoi du mail de stratégie à : ${cleanEmail}...`);

  const allStrategies = STRATEGY_FILES.map(file => {
    const title = file.name.replace('.txt', '').replace(/_/g, ' ').toUpperCase();
    return `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📜 STRATEGY: ${title}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${file.content}\n`;
  }).join("\n\n");

  const now = new Date();
  const formattedTime = now.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Paramètres mappés sur template_2018kch
  const templateParams = {
    user_email: cleanEmail,
    email: cleanEmail,
    to_name: cleanName,
    user_name: cleanName,
    message: allStrategies,
    user_message: allStrategies,
    time: formattedTime,
    from_name: "ALGOBROS AI TERMINAL"
  };

  try {
    // @ts-ignore
    const emailjs = window.emailjs;
    if (!emailjs) {
      console.error("❌ SDK EmailJS non détecté dans window");
      throw new Error("EmailJS SDK not found.");
    }

    const result = await emailjs.send("service_0owc3xi", "template_2018kch", templateParams);
    console.log("✅ Mail de stratégie expédié avec succès !", result.status, result.text);
    return true;
  } catch (error: any) {
    console.error("❌ Erreur EmailJS Critique:", error);
    // On ne bloque pas le reste de l'app si l'email échoue (ex: quota atteint)
    return false;
  }
};

/**
 * Notification Admin
 */
export const sendAdminNotification = async (userData: any, plan: string, txId: string) => {
  try {
    if (userData?.email === "AlgobrosIA@gmail.com") return;

    // @ts-ignore
    const emailjs = window.emailjs;
    if (!emailjs) return;

    const adminParams = {
      user_email: "AlgobrosIA@gmail.com", 
      to_name: "ADMIN ALGOBROS",
      from_name: "SYSTEM ALERT",
      message: `
        🚨 NOUVELLE ACTIVATION DETECTÉE 🚨
        
        Client: ${userData?.firstName || 'Inconnu'} ${userData?.lastName || ''}
        Email: ${userData?.email}
        Plan: ${plan}
        Code/TxID: ${txId}
        Date: ${new Date().toLocaleString()}
      `,
      time: new Date().toISOString()
    };

    await emailjs.send("service_0owc3xi", "template_2018kch", adminParams);
    console.log("✅ Admin notifié de la nouvelle vente");
  } catch (e) {
    console.error("❌ Notification Admin échouée", e);
  }
};
