import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Gem, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-radial from-brand-gold/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-[120px] animate-glow-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] animate-glow-pulse [animation-delay:1.5s]" />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-gold/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-8">
              <Sparkles size={16} />
              Premium Custom Jewelry Studio
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6"
          >
            Design Your{' '}
            <span className="text-gradient-gold">Perfect</span>
            <br />
            Nameplate
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Craft personalized gold & silver jewelry with our interactive live design studio.
            Choose from templates, customize freely, or let AI bring your vision to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/customizer" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group">
              Start Designing
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/gallery" className="btn-ghost text-lg px-8 py-4 flex items-center justify-center gap-2">
              <Gem size={20} /> View Gallery
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-gradient-gold">Works</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">Three powerful ways to create your dream piece</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Gem size={28} />,
                title: 'Pre-Designed Names',
                desc: 'Browse our curated catalog and swap in your own name while keeping the premium styling.',
                gradient: 'from-brand-gold/20 to-amber-500/20',
                border: 'border-brand-gold/20',
              },
              {
                icon: <Sparkles size={28} />,
                title: 'Blank Template Studio',
                desc: 'Start from scratch — pick a shape, choose fonts, add decorative elements with a live preview.',
                gradient: 'from-blue-500/20 to-purple-500/20',
                border: 'border-blue-500/20',
              },
              {
                icon: <Star size={28} />,
                title: 'AI Generator',
                desc: 'Describe your dream design and let our AI create a unique concept just for you.',
                gradient: 'from-purple-500/20 to-pink-500/20',
                border: 'border-purple-500/20',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`glass-card p-8 border ${feature.border} hover:border-opacity-50 transition-all group`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card gold-glow p-12 md:p-16 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
                Ready to Create Something{' '}
                <span className="text-gradient-gold">Unique</span>?
              </h2>
              <p className="text-white/50 mb-8 max-w-lg mx-auto">
                Your custom jewelry journey starts here. Design it, price it live, and order — all in one place.
              </p>
              <Link to="/customizer" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2 group">
                Open Design Studio
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
