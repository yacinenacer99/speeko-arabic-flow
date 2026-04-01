import { useIsMobile } from '@/hooks/use-mobile';

interface HeroButtonProps {
  onClick?: () => void;
}

export default function HeroButton({ onClick }: HeroButtonProps) {
  const isMobile = useIsMobile();
  const size = isMobile ? 200 : 240;

  return (
    <div className="hero-float" style={{ display: 'inline-block' }}>
      <div className="hero-stroke-wrapper">
        <div
          className="hero-circle"
          style={{ width: size, height: size }}
          onClick={onClick}
        >
          <div className="hero-text-overlay">
            <span
              style={{
                fontFamily: 'Cairo, sans-serif',
                fontWeight: 700,
                fontSize: 20,
                color: 'white',
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
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
      </div>
    </div>
  );
}
