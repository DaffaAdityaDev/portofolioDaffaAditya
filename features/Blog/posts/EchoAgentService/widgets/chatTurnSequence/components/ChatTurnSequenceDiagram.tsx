import React from 'react';
import { MessagesSquare } from 'lucide-react';
import type { SequenceDefinition } from '@/features/Blog/sequence/types';
import type { ChatTurnLaneId } from '@/features/Blog/posts/EchoAgentService/widgets/chatTurnSequence/types';
import SequenceDiagram from '@/features/Blog/sequence/components/SequenceDiagram';
import { CHAT_TURN_LANES, CHAT_TURN_LEGEND, CHAT_TURN_STEPS } from '../constants';

const CHAT_TURN_SEQUENCE: SequenceDefinition<ChatTurnLaneId> = {
  title: 'One chat turn',
  icon: MessagesSquare,
  ariaLabel: 'Sequence diagram of a chat turn: the client posts a message, the gateway counts tokens and starts a mission on the agent, the agent streams from the LLM, and the gateway relays the SSE packets back to the client',
  width: 880,
  minWidthClass: 'min-w-[660px]',
  lanes: CHAT_TURN_LANES,
  steps: CHAT_TURN_STEPS,
  legend: CHAT_TURN_LEGEND,
};

/** A chat turn from the client to the model and back, one lane per service. */
const ChatTurnSequenceDiagram: React.FC = () => <SequenceDiagram definition={CHAT_TURN_SEQUENCE} />;

export default ChatTurnSequenceDiagram;
