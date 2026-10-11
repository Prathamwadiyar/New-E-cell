import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import GlowButton from '../ui/GlowButton';

const fields = [
  { id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210' },
  { id: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help you?' },
];

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate client-side message reception and persistence
      await new Promise((res) => setTimeout(res, 500));
      const existing = JSON.parse(localStorage.getItem('jcer_contact_messages') || '[]');
      existing.push({
        ...formData,
        id: 'msg-' + Date.now(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('jcer_contact_messages', JSON.stringify(existing));

      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      console.error("Error submitting message: ", error);
      alert("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass glow-border rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-5 h-full min-h-[400px]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          <CheckCircle className="w-16 h-16 text-ecell-glow" />
        </motion.div>
        <h3 className="font-sora font-bold text-2xl text-white">Message Sent!</h3>
        <p className="text-ecell-gray max-w-sm">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-ecell-light text-sm hover:text-white transition-colors font-inter underline underline-offset-4"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="glass glow-border rounded-2xl p-8 space-y-5"
    >
      <div>
        <h3 className="font-sora font-bold text-2xl text-white mb-1">Send a Message</h3>
        <p className="text-ecell-gray text-sm">We'd love to hear from you.</p>
      </div>

      {/* Two-column fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.slice(0, 2).map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-ecell-gray text-xs font-inter font-medium mb-2 tracking-wide">
              {label}
            </label>
            <input
              id={id}
              type={type}
              value={formData[id]}
              onChange={handleChange}
              placeholder={placeholder}
              required
              className="input-field"
            />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.slice(2, 4).map(({ id, label, type, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-ecell-gray text-xs font-inter font-medium mb-2 tracking-wide">
              {label}
            </label>
            <input
              id={id}
              type={type}
              value={formData[id]}
              onChange={handleChange}
              placeholder={placeholder}
              className="input-field"
            />
          </div>
        ))}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-ecell-gray text-xs font-inter font-medium mb-2 tracking-wide">
          Message
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your idea, query, or how you'd like to collaborate..."
          rows={5}
          required
          className="input-field resize-none"
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(59,130,246,0.5)' }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl
          bg-ecell-blue text-white font-inter font-semibold text-sm
          hover:bg-ecell-glow transition-all duration-300 disabled:opacity-60"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </motion.button>
    </motion.form>
  );
};

export default ContactForm;
