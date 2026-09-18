import mark from '../../assets/logo-green.png';
import { BRAND } from '../../lib/brand';

export function BrandLogo({
  className = 'h-8 w-8',
  alt = BRAND.name,
}: {
  className?: string;
  alt?: string;
}) {
  return <img src={mark} alt={alt} className={`object-contain ${className}`} />;
}
