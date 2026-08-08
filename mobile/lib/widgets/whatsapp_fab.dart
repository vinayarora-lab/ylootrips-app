import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:google_fonts/google_fonts.dart';
import '../config/app_config.dart';

class WhatsAppFab extends StatelessWidget {
  final String? message;
  const WhatsAppFab({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      onPressed: () async {
        final msg = message ?? 'Hi! I\'m interested in booking a trip to India.';
        final url = Uri.parse(AppConfig.whatsappUrl(msg));
        if (await canLaunchUrl(url)) {
          await launchUrl(url, mode: LaunchMode.externalApplication);
        }
      },
      backgroundColor: const Color(0xFF25D366),
      elevation: 4,
      icon: const Icon(Icons.chat, color: Colors.white, size: 20),
      label: Text(
        'WhatsApp',
        style: GoogleFonts.inter(
          fontSize: 13,
          fontWeight: FontWeight.w600,
          color: Colors.white,
        ),
      ),
    );
  }
}
