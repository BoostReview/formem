"use client"

import * as React from "react"
import { FormBlock } from "@/types"
import { BlockWrapper } from "./blocks/BlockWrapper"
import { WelcomeBlock } from "./blocks/WelcomeBlock"
import { HeadingBlock } from "./blocks/HeadingBlock"
import { ParagraphBlock } from "./blocks/ParagraphBlock"
import { SingleChoiceBlock } from "./blocks/SingleChoiceBlock"
import { MultipleChoiceBlock } from "./blocks/MultipleChoiceBlock"
import { TextBlock } from "./blocks/TextBlock"
import { TextareaBlock } from "./blocks/TextareaBlock"
import { EmailBlock } from "./blocks/EmailBlock"
import { PhoneBlock } from "./blocks/PhoneBlock"
import { NumberBlock } from "./blocks/NumberBlock"
import { SliderBlock } from "./blocks/SliderBlock"
import { DateBlock } from "./blocks/DateBlock"
import { YesNoBlock } from "./blocks/YesNoBlock"
import { ConsentBlock } from "./blocks/ConsentBlock"
import { YouTubeBlock } from "./blocks/YouTubeBlock"
import { CaptchaBlock } from "./blocks/CaptchaBlock"
import { MenuRestaurantBlock } from "./blocks/MenuRestaurantBlock"
import { FileBlock } from "./blocks/FileBlock"
import { ImageBlock } from "./blocks/ImageBlock"
import { DropdownBlock } from "./blocks/DropdownBlock"
import { RatingBlock } from "./blocks/RatingBlock"
import { AddressBlock } from "./blocks/AddressBlock"
import { WebsiteBlock } from "./blocks/WebsiteBlock"

interface BlockRendererProps {
  block: FormBlock
  isSelected: boolean
  isEditing?: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<FormBlock>) => void
  onDuplicate: () => void
  onDelete: () => void
  dragListeners?: any
  dragAttributes?: any
}

export function BlockRenderer({
  block,
  isSelected,
  isEditing = true,
  onSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  dragListeners,
  dragAttributes,
}: BlockRendererProps) {
  const renderBlockContent = () => {
    const commonProps = {
      block,
      isEditing,
      onUpdate,
    }

    switch (block.type) {
      case "welcome":
        return <WelcomeBlock {...commonProps} />
      case "heading":
        return (
          <HeadingBlock
            {...commonProps}
            onUpdate={(label) => onUpdate({ label })}
          />
        )
      case "paragraph":
        return (
          <ParagraphBlock
            {...commonProps}
            onUpdate={(label) => onUpdate({ label })}
          />
        )
      case "single-choice":
        return <SingleChoiceBlock {...commonProps} />
      case "multiple-choice":
        return <MultipleChoiceBlock {...commonProps} />
      case "text":
        return <TextBlock {...commonProps} />
      case "textarea":
        return <TextareaBlock {...commonProps} />
      case "email":
        return <EmailBlock {...commonProps} />
      case "phone":
        return <PhoneBlock {...commonProps} />
      case "number":
        return <NumberBlock {...commonProps} />
      case "slider":
        return <SliderBlock {...commonProps} />
      case "date":
        return <DateBlock {...commonProps} />
      case "yes-no":
        return <YesNoBlock {...commonProps} />
      case "consent":
        return <ConsentBlock {...commonProps} />
      case "captcha":
        return <CaptchaBlock {...commonProps} />
      case "file":
        return <FileBlock {...commonProps} />
      case "youtube":
        return <YouTubeBlock {...commonProps} />
      case "menu-restaurant":
        return <MenuRestaurantBlock {...commonProps} />
      case "image":
        return <ImageBlock {...commonProps} />
      case "dropdown":
        return <DropdownBlock {...commonProps} />
      case "rating":
        return <RatingBlock {...commonProps} />
      case "address":
        return <AddressBlock {...commonProps} />
      case "website":
        return <WebsiteBlock {...commonProps} />
      default:
        return <div className="text-muted-foreground">Bloc inconnu</div>
    }
  }

  return (
    <BlockWrapper
      id={block.id}
      isSelected={isSelected}
      onSelect={onSelect}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      dragListeners={dragListeners}
      dragAttributes={dragAttributes}
    >
      {renderBlockContent()}
    </BlockWrapper>
  )
}

