import React from 'react';
import { Chip } from '@/components/atoms';
import { EventTopic } from '@/features/events/schema';
import { TOPIC_REGISTRY } from '@/features/news/topics';

export interface TopicChipProps {
  topic: EventTopic;
  active: boolean;
  count?: number;
  onToggle: (topic: EventTopic) => void;
}

export const TopicChip: React.FC<TopicChipProps> = ({
  topic,
  active,
  count,
  onToggle,
}) => {
  const config = TOPIC_REGISTRY[topic];

  return (
    <Chip
      active={active}
      color={config.color}
      onClick={() => onToggle(topic)}
      title={config.description}
    >
      <span>{config.label}</span>
      {typeof count === 'number' ? (
        <span className="ml-1 opacity-75 font-mono text-[10px]">({count})</span>
      ) : null}
    </Chip>
  );
};
