import { WelcomeBlock } from "./WelcomeBlock";
import { HeadingBlock } from "./HeadingBlock";
import { ParagraphBlock } from "./ParagraphBlock";
import { SingleChoiceBlock } from "./SingleChoiceBlock";
import { MultipleChoiceBlock } from "./MultipleChoiceBlock";
import { TextBlock } from "./TextBlock";
import { TextareaBlock } from "./TextareaBlock";
import { EmailBlock } from "./EmailBlock";
import { PhoneBlock } from "./PhoneBlock";
import { NumberBlock } from "./NumberBlock";
import { SliderBlock } from "./SliderBlock";
import { DateBlock } from "./DateBlock";
import { YesNoBlock } from "./YesNoBlock";
import { ConsentBlock } from "./ConsentBlock";
import { YouTubeBlock } from "./YouTubeBlock";
import { CaptchaBlock } from "./CaptchaBlock";
import { MenuRestaurantBlock } from "./MenuRestaurantBlock";
import { FileBlock } from "./FileBlock";
import { ImageBlock } from "./ImageBlock";
import { DropdownBlock } from "./DropdownBlock";
import { RatingBlock } from "./RatingBlock";
import { AddressBlock } from "./AddressBlock";
import { WebsiteBlock } from "./WebsiteBlock";
import type { FormBlock } from "@/types";

interface BlockRendererProps {
  block: FormBlock;
  value?: unknown;
  onChange: (blockId: string, value: unknown) => void;
}

export function renderBlock(
  block: FormBlock,
  value: unknown,
  onChange: (blockId: string, value: unknown) => void
) {
  const props = {
    block,
    value,
    onChange: (newValue: unknown) => onChange(block.id, newValue),
  };

  switch (block.type) {
    case "welcome":
      return <WelcomeBlock {...props} />;
    case "heading":
      return <HeadingBlock {...props} />;
    case "paragraph":
      return <ParagraphBlock {...props} />;
    case "single-choice":
      return <SingleChoiceBlock {...props} />;
    case "multiple-choice":
      return <MultipleChoiceBlock {...props} />;
    case "text":
      return <TextBlock {...props} />;
    case "textarea":
      return <TextareaBlock {...props} />;
    case "email":
      return <EmailBlock {...props} />;
    case "phone":
      return <PhoneBlock {...props} />;
    case "number":
      return <NumberBlock {...props} />;
    case "slider":
      return <SliderBlock {...props} />;
    case "date":
      return <DateBlock {...props} />;
    case "yes-no":
      return <YesNoBlock {...props} />;
    case "consent":
      return <ConsentBlock {...props} />;
    case "captcha":
      return <CaptchaBlock {...props} />;
    case "file":
      return <FileBlock {...props} />;
    case "youtube":
      return <YouTubeBlock {...props} />;
    case "menu-restaurant":
      return <MenuRestaurantBlock {...props} />;
    case "image":
      return <ImageBlock {...props} />;
    case "dropdown":
      return <DropdownBlock {...props} />;
    case "rating":
      return <RatingBlock {...props} />;
    case "address":
      return <AddressBlock {...props} />;
    case "website":
      return <WebsiteBlock {...props} />;
    default:
      return (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Type de bloc non supporté: {block.type}
          </p>
        </div>
      );
  }
}

