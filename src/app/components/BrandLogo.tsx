import { BRAND } from '../../lib/brand';

export function BrandLogo({
  className = 'h-8 w-8',
  alt = BRAND.name,
}: {
  className?: string;
  alt?: string;
}) {
  return <img src="/logo_no_name.svg" alt={alt} className={`object-contain ${className}`} />;
}
