import React from 'react';

interface SEOContentProps {
  path: string;
}

export const SEOContent: React.FC<SEOContentProps> = ({ path }) => {
  const getContent = () => {
    switch (path) {
      case '/talk-to-strangers-online':
        return {
          h2: "Why Talk to Strangers Online in 2025?",
          body: "In a world connected by algorithms, finding a genuine human connection feels harder than ever. StrangerConnect brings back the raw, unfiltered experience of meeting someone new without the pressure of profiles or followers. Whether you're looking for a quick chat to pass the time or a deep conversation with someone on the other side of the world, our anonymous platform is designed for pure human interaction. No signup means you can go from lonely to laughing in less than 3 seconds."
        };
      case '/anonymous-chat-no-signup':
        return {
          h2: "The Power of Anonymous Chat with No Signup",
          body: "Privacy is a luxury. Most 'anonymous' apps today ask for your phone number or email, essentially tracking your every move. StrangerConnect is different. We believe that true anonymity starts with zero registration. By skipping the signup process, we ensure that your identity is never linked to your conversations. This is the safest way to vent, share secrets, or just vibe with strangers without worrying about your digital footprint. Your secrets are safe here because we don't even know who you are."
        };
      case '/lonely-talk-someone':
        return {
          h2: "Feeling Lonely? Talk to Someone Who Understands",
          body: "Loneliness isn't just about being alone; it's about not being heard. When the weight of the day feels too heavy, sometimes all you need is a stranger's perspective. Our 'Talk to Someone' niche is dedicated to those who need an empathetic ear. On StrangerConnect, you'll find night owls, dreamers, and people just like you who are looking for a moment of connection. It's okay to not be okay, and it's okay to reach out to a stranger to share what's on your mind. We provide the bridge; you provide the voice."
        };
      case '/random-chat-india':
        return {
          h2: "Connect with Random Chat India - Local Vibes, Global Platform",
          body: "India is a land of stories, and millions of them are happening right now. StrangerConnect's India-specific portal allows you to connect with strangers from Mumbai to Delhi, Bangalore to Kolkata, or even the diaspora abroad. Whether you want to discuss the latest cricket match, share a recipe, or just find someone local to vibe with at night, our P2P platform is the fastest growing anonymous hub in the subcontinent. Experience the diversity of India through one-on-one private conversations."
        };
      case '/anonymous-chat-at-night':
        return {
          h2: "The Best Anonymous Chat at Night for Night Owls",
          body: "There's a specific kind of honesty that only comes out after 2 AM. When the world is quiet, our minds get loud. StrangerConnect is the ultimate destination for the overthinkers and the midnight dreamers. If you're looking for an anonymous chat at night, you'll find thousands of others awake, staring at their screens, waiting to talk about life, the universe, and everything in between. Skip the mindless scrolling and find a real conversation that matches the midnight vibe."
        };
      default:
        return {
          h2: "Instant Anonymous Connections Worldwide",
          body: "StrangerConnect is the next generation of anonymous P2P chatting. We've stripped away the ads (mostly), the bots, and the corporate tracking to give you a clean space to talk to strangers. Our mission is to facilitate 1 billion vibe checks by 2030. Join the movement of people choosing privacy and realness over social media performance."
        };
    }
  };

  const content = getContent();

  return (
    <section className="mt-24 px-6 max-w-4xl mx-auto border-t border-white/5 pt-16 pb-20">
      <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white/80 mb-6">
        {content.h2}
      </h2>
      <div className="text-white/40 leading-relaxed space-y-4 font-medium text-lg">
        <p>{content.body}</p>
        <p>
          Our platform utilizes cutting-edge WebRTC technology to ensure that your data is sent directly to your partner. This Peer-to-Peer (P2P) architecture means we never touch your messages. Security, speed, and simplicity are the pillars of the StrangerConnect experience. Start your vibe check today and see why we are the fastest growing talk-to-strangers platform on the web.
        </p>
      </div>
      
      {/* Long-tail SEO Keyword Cloud */}
      <div className="mt-12 flex flex-wrap gap-3 opacity-20">
        {["anonymous talk", "meet new people", "chat with strangers", "no logs chat", "p2p privacy", "midnight talk", "lonely chat", "india random chat", "safe online space", "zero registration"].map(tag => (
          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest border border-white px-3 py-1 rounded-full">
            #{tag.replace(/\s+/g, '')        }
          </span>
        ))}
      </div>
    </section>
  );
};