import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { ReactNode } from 'react';

interface DragAndDropListProps<I> {
  direction?: 'horizontal' | 'vertical';
  reorder: (sourceIndex: number, destinationIndex: number) => void;
  items: I[];
  renderItem: (item: I, index: number) => ReactNode;
}

function DragAndDropList<I>(props: DragAndDropListProps<I>) {
  return (
    <DragDropContext onDragEnd={({destination, source}) => props.reorder(source.index, destination?.index ?? 0)}>
      <Droppable droppableId='dnd-list' direction={props.direction ?? 'vertical'}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            { props.items.map((item: I, index: number) => (
              <Draggable key={index} index={index} draggableId={''+index}>
                {(provided) => (
                  <div {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                    { props.renderItem(item, index) }
                  </div>
                )}
              </Draggable>
            )) }
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DragAndDropList;