import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../config/app_config.dart';
import '../../config/theme.dart';
import '../../services/analytics_service.dart';
import '../../services/api_service.dart';
import '../../widgets/whatsapp_fab.dart';

class TripPlannerScreen extends StatefulWidget {
  const TripPlannerScreen({super.key});

  @override
  State<TripPlannerScreen> createState() => _TripPlannerScreenState();
}

class _TripPlannerScreenState extends State<TripPlannerScreen> {
  final _ctrl = TextEditingController();
  final _scroll = ScrollController();
  final _focus = FocusNode();
  final List<_Msg> _msgs = [];
  bool _loading = false;

  static const _suggestions = [
    '7 days in Rajasthan under ₹50,000',
    'Honeymoon in Bali for 6 nights',
    'Kerala backwaters family trip',
    'Budget Thailand trip from Delhi',
    'Kashmir tour in summer',
    'Maldives luxury 5 nights',
  ];

  @override
  void initState() {
    super.initState();
    AnalyticsService.screen('trip_planner');
    _msgs.add(_Msg(
      text: "Hello! I'm your AI Travel Planner powered by Groq & Gemini.\n\nTell me your dream trip — destination, budget, duration, travel style — and I'll craft a personalized itinerary for you!",
      isUser: false,
    ));
  }

  @override
  void dispose() {
    _ctrl.dispose();
    _scroll.dispose();
    _focus.dispose();
    super.dispose();
  }

  Future<void> _send([String? preset]) async {
    final text = preset ?? _ctrl.text.trim();
    if (text.isEmpty || _loading) return;
    _ctrl.clear();
    _focus.unfocus();
    setState(() {
      _msgs.add(_Msg(text: text, isUser: true));
      _loading = true;
    });
    _scrollDown();

    final reply = await ApiService().planTrip(text);
    if (mounted) {
      setState(() {
        _msgs.add(_Msg(text: reply, isUser: false));
        _loading = false;
      });
      _scrollDown();
    }
  }

  void _scrollDown() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scroll.hasClients) {
        _scroll.animateTo(_scroll.position.maxScrollExtent,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOut);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.cream,
      floatingActionButton: const WhatsAppFab(),
      appBar: AppBar(
        backgroundColor: AppTheme.white,
        elevation: 0,
        scrolledUnderElevation: 0.5,
        shadowColor: AppTheme.borderGray,
        leading: GoRouter.of(context).canPop()
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_rounded, size: 20, color: Color(0xFF1C1C1C)),
                onPressed: () => GoRouter.of(context).pop(),
              )
            : null,
        automaticallyImplyLeading: false,
        title: Row(
          children: [
            Container(
              width: 34, height: 34,
              decoration: BoxDecoration(
                color: AppTheme.secondary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.auto_awesome, color: Colors.white, size: 18),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Yloo AI',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.primary)),
                Text('Your personal AI travel expert',
                  style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textGray)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_outlined, color: AppTheme.textGray),
            onPressed: () => setState(() {
              _msgs.clear();
              _msgs.add(_Msg(
                text: "Hello! I'm your AI Travel Planner.\n\nTell me your dream trip and I'll craft a personalized itinerary for you!",
                isUser: false,
              ));
            }),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              itemCount: _msgs.length + (_loading ? 1 : 0),
              itemBuilder: (_, i) {
                if (i == _msgs.length) return const _TypingIndicator();
                return _ChatBubble(msg: _msgs[i]);
              },
            ),
          ),

          // Suggestions
          if (_msgs.length == 1 && !_loading)
            _SuggestionsBar(suggestions: _suggestions, onTap: _send),

          // WhatsApp book CTA after conversation
          if (_msgs.length > 2)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 4, 16, 0),
              child: OutlinedButton.icon(
                onPressed: () async {
                  final last = _msgs.lastWhere((m) => m.isUser,
                      orElse: () => _Msg(text: '', isUser: true));
                  final url = Uri.parse(AppConfig.whatsappUrl(
                      'Hi! I used the AI Planner and want to book: ${last.text}'));
                  if (await canLaunchUrl(url)) {
                    launchUrl(url, mode: LaunchMode.externalApplication);
                  }
                },
                icon: const Icon(Icons.chat, size: 16),
                label: Text('Book this trip on WhatsApp',
                  style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF25D366),
                  side: const BorderSide(color: Color(0xFF25D366)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(vertical: 11),
                  minimumSize: const Size(double.infinity, 0),
                ),
              ),
            ),

          // Input
          Container(
            color: AppTheme.white,
            padding: EdgeInsets.fromLTRB(
                12, 10, 12, MediaQuery.of(context).viewInsets.bottom + 10),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _ctrl,
                    focusNode: _focus,
                    minLines: 1,
                    maxLines: 4,
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _send(),
                    style: GoogleFonts.inter(fontSize: 14),
                    decoration: InputDecoration(
                      hintText: 'Describe your dream trip...',
                      hintStyle: GoogleFonts.inter(
                          fontSize: 14, color: AppTheme.textGray),
                      filled: true,
                      fillColor: AppTheme.creamDark,
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 10),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: _loading ? null : () => _send(),
                  child: Container(
                    width: 44, height: 44,
                    decoration: BoxDecoration(
                      color: _loading ? AppTheme.creamDark : AppTheme.secondary,
                      shape: BoxShape.circle,
                    ),
                    child: _loading
                        ? const Padding(
                            padding: EdgeInsets.all(12),
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: AppTheme.secondary))
                        : const Icon(Icons.send_rounded,
                            color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Msg {
  final String text;
  final bool isUser;
  _Msg({required this.text, required this.isUser});
}

class _ChatBubble extends StatelessWidget {
  final _Msg msg;
  const _ChatBubble({required this.msg});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment:
            msg.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!msg.isUser) ...[
            Container(
              width: 30, height: 30,
              decoration: BoxDecoration(
                color: AppTheme.secondary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.auto_awesome,
                  color: Colors.white, size: 16),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: msg.isUser ? AppTheme.secondary : AppTheme.white,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(16),
                  topRight: const Radius.circular(16),
                  bottomLeft:
                      Radius.circular(msg.isUser ? 16 : 4),
                  bottomRight:
                      Radius.circular(msg.isUser ? 4 : 16),
                ),
                boxShadow: [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.05),
                      blurRadius: 6)
                ],
              ),
              child: Text(msg.text,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color:
                      msg.isUser ? Colors.white : AppTheme.charcoal,
                  height: 1.55,
                )),
            ),
          ),
          if (msg.isUser) const SizedBox(width: 8),
        ],
      ),
    );
  }
}

class _TypingIndicator extends StatelessWidget {
  const _TypingIndicator();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Container(
            width: 30, height: 30,
            decoration: BoxDecoration(
                color: AppTheme.secondary,
                borderRadius: BorderRadius.circular(8)),
            child: const Icon(Icons.auto_awesome,
                color: Colors.white, size: 16),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(
                horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: AppTheme.white,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                topRight: Radius.circular(16),
                bottomLeft: Radius.circular(4),
                bottomRight: Radius.circular(16),
              ),
              boxShadow: [
                BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 6)
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(
                  3,
                  (i) => Padding(
                        padding:
                            EdgeInsets.only(right: i < 2 ? 4 : 0),
                        child: _Dot(delay: i * 200),
                      )),
            ),
          ),
        ],
      ),
    );
  }
}

class _Dot extends StatefulWidget {
  final int delay;
  const _Dot({required this.delay});
  @override
  State<_Dot> createState() => _DotState();
}

class _DotState extends State<_Dot>
    with SingleTickerProviderStateMixin {
  late AnimationController _c;
  late Animation<double> _a;

  @override
  void initState() {
    super.initState();
    _c = AnimationController(
        duration: const Duration(milliseconds: 600), vsync: this);
    _a = Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _c, curve: Curves.easeInOut));
    Future.delayed(Duration(milliseconds: widget.delay), () {
      if (mounted) _c.repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _a,
        builder: (_, __) => Container(
          width: 8, height: 8,
          decoration: BoxDecoration(
            color: Color.lerp(
                AppTheme.textGray, AppTheme.secondary, _a.value),
            shape: BoxShape.circle,
          ),
        ),
      );
}

class _SuggestionsBar extends StatelessWidget {
  final List<String> suggestions;
  final Function(String) onTap;
  const _SuggestionsBar(
      {required this.suggestions, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 4, 16, 8),
          child: Text('Try asking...',
            style: GoogleFonts.inter(
                fontSize: 11,
                color: AppTheme.textGray,
                fontWeight: FontWeight.w600)),
        ),
        SizedBox(
          height: 38,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: suggestions.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (_, i) => GestureDetector(
              onTap: () => onTap(suggestions[i]),
              child: Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: AppTheme.white,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderGray),
                ),
                child: Text(suggestions[i],
                  style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.secondary,
                      fontWeight: FontWeight.w500)),
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }
}
