import { useIsMobile } from '@/hooks/use-mobile';

interface HeroButtonProps {
  onClick?: () => void;
}

export default function HeroButton({ onClick }: HeroButtonProps) {
  const isMobile = useIsMobile();
  const size = isMobile ? 240 : 280;

  return (
    <div
      className="hero-btn-wrapper"
      style={{ padding: 6, borderRadius: '50%', display: 'inline-block' }}
      onClick={onClick}
    >
      <div
        className="hero-btn"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: '#0F0F14',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          gap: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 700,
            fontSize: 20,
            color: 'white',
          }}
        >
          ابدأ التحدي
        </span>
        <span
          style={{
            fontFamily: 'Cairo, sans-serif',
            fontWeight: 300,
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          تكلم الآن
        </span>
      </div>
    </div>
  );
}
