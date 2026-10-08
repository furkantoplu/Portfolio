# Beyaz önlüklü ana sayfa portresi

- Tarih: 8 Ekim 2026 (Europe/Istanbul).
- Yöntem: yerleşik image_gen, background-extraction, transparent_background=true. CLI/API anahtarı kullanılmadı.
- Kaynak: kullanıcının bu turda verdiği beyaz önlüklü fotoğraf; kaynak fotoğraf Git'e kopyalanmadı.
- Proje çıktısı: frontend/public/furkan-toplu-hero-white-coat-v1.png.
- Kullanım: belden yukarı şeffaf PNG; mevcut CSS perspective, drop-shadow, z-index ve alt maske ile 3D hissi. Bu gerçek bir 3D mesh/model değildir.
- İmaj non-destructive yeni dosyaya kopyalandı; önceki kırmızı tişörtlü dosya korunur. Otomatik düzenleme kimliği mümkün olduğunca korur; son görünüm müşteri tarafından onaylanmalıdır.
- Alfa incelemesi: 1086×1448, arka plan alpha=0; kişide ağırlıklı alpha=252–253 (~%99 opak). Kısmi alfa kenar/yumuşak bitiş içerir.

## Kullanılan tam istem

Use case: background-extraction. Asset type: transparent homepage foreground hero portrait. Image 1 is the EDIT TARGET, not a style suggestion. Extract ONLY the exact man in the attached photograph, framed from the top of his hair to his waist (a little below the crossed forearms, around the coat pocket level), NO legs and no full-length coat. Preserve his actual face, identity, hairstyle, beard, neutral expression, crossed arms, hands, white medical coat and black shirt, body proportions and photographic texture as faithfully as possible. Do not turn him into a cartoon or redesign him. Remove ALL clinic background, curtains, ceiling, furnishings and equipment, including any background between the silhouette. Genuinely transparent alpha background, not a drawn checkerboard or flat color. Closely framed vertical composition, entire head and both elbows intact, subject fills about 90% canvas height, small transparent margin around hair/sides and no large empty area. Natural dimensional lighting already present in the photo; subtle clean highlights and fabric shading suitable for a layered 3D-feeling website cutout. No baked scene, no pedestal, no frame, no added text or accessories, no outer glow, no heavy fake shadow. Lower waist edge fades gently into transparency in only the bottom 8% so there is no abrupt straight cut; keep crossed arms fully opaque. Website will add its own CSS perspective, shadows and final fade.

