import type { FormBlock } from "@/types";

interface MenuRestaurantBlockProps {
  block: FormBlock;
  value?: unknown;
  onChange: (value: unknown) => void;
}

export function MenuRestaurantBlock({ block }: MenuRestaurantBlockProps) {
  const sections = (block.sections as any[]) || [];
  const backgroundImage = (block.backgroundImage as string) || null
  const backgroundStyle = backgroundImage
    ? backgroundImage.startsWith("http") || backgroundImage.startsWith("/")
      ? {
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }
      : {
          background: backgroundImage,
        }
    : {}

  return (
    <div 
      className="w-full space-y-6 pt-8 rounded-lg p-6 transition-all"
      style={backgroundStyle}
    >
      <h2 className="text-2xl font-bold block pb-3 pt-4 leading-tight border-b-2 border-gray-300 mb-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded">
        {block.label || "Menu Restaurant"}
      </h2>
      
      <div className="space-y-8">
        {sections.map((section: any, sectionIndex: number) => (
          <div key={sectionIndex} className="space-y-4 p-4 border rounded-lg bg-white/90 backdrop-blur-sm shadow-sm">
            {/* Titre de section */}
            <h3 className="text-xl font-semibold border-b pb-2">
              {section.name || `Section ${sectionIndex + 1}`}
            </h3>
            
            {/* Items de la section */}
            <div className="space-y-4">
              {(section.items || []).map((item: any, itemIndex: number) => (
                <div 
                  key={itemIndex}
                  className="flex justify-between items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-base">
                      {item.name || "Plat sans nom"}
                    </h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {item.price && (
                    <div className="font-semibold text-lg whitespace-nowrap">
                      {item.price}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
          Ce menu n'a pas encore été configuré
        </div>
      )}
    </div>
  );
}

