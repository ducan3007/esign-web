import clsx from 'clsx';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import styles from './List.example.css';
import AutoSizer from '../AutoSizer';
import List from './List';
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox';
import { LabeledInput, InputRow } from '../demo/LabeledInput';

// Import the hooks
import { useContext, useState, useEffect } from 'react';

// Define a function component with the same name
export default function ListExample(props) {
  // Use useContext to access the list
  const list = useContext(ListContext);

  // Use useState to create state variables
  const [listHeight, setListHeight] = useState(300);
  const [listRowHeight, setListRowHeight] = useState(50);
  const [overscanRowCount, setOverscanRowCount] = useState(10);
  const [rowCount, setRowCount] = useState(list.size);
  const [scrollToIndex, setScrollToIndex] = useState(undefined);
  const [showScrollingPlaceholder, setShowScrollingPlaceholder] = useState(false);
  const [useDynamicRowHeight, setUseDynamicRowHeight] = useState(false);

  // Use useEffect to replace the constructor and bind the methods
  useEffect(() => {
    // Bind the methods
    _getRowHeight = _getRowHeight.bind(this);
    _noRowsRenderer = _noRowsRenderer.bind(this);
    _onRowCountChange = _onRowCountChange.bind(this);
    _onScrollToRowChange = _onScrollToRowChange.bind(this);
    _rowRenderer = _rowRenderer.bind(this);

    // No need to return anything
  }, []); // Use an empty dependency array

  // Return the JSX from the render method
  return (
    <ContentBox>
      <ContentBoxHeader
        text="List"
        sourceLink="https://github.com/bvaughn/react-virtualized/blob/master/source/List/List.example.js"
        docsLink="https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md"
      />

      <ContentBoxParagraph>
        The list below is windowed (or "virtualized") meaning that only the visible rows are rendered. Adjust its configurable
        properties below to see how it reacts.
      </ContentBoxParagraph>

      <ContentBoxParagraph>
        <label className={styles.checkboxLabel}>
          <input
            aria-label="Use dynamic row heights?"
            checked={useDynamicRowHeight}
            className={styles.checkbox}
            type="checkbox"
            onChange={(event) => setUseDynamicRowHeight(event.target.checked)}
          />
          Use dynamic row heights?
        </label>

        <label className={styles.checkboxLabel}>
          <input
            aria-label="Show scrolling placeholder?"
            checked={showScrollingPlaceholder}
            className={styles.checkbox}
            type="checkbox"
            onChange={(event) => setShowScrollingPlaceholder(event.target.checked)}
          />
          Show scrolling placeholder?
        </label>
      </ContentBoxParagraph>

      <InputRow>
        <LabeledInput label="Num rows" name="rowCount" onChange={_onRowCountChange} value={rowCount} />
        <LabeledInput
          label="Scroll to"
          name="onScrollToRow"
          placeholder="Index..."
          onChange={_onScrollToRowChange}
          value={scrollToIndex || ''}
        />
        <LabeledInput
          label="List height"
          name="listHeight"
          onChange={(event) => setListHeight(parseInt(event.target.value, 10) || 1)}
          value={listHeight}
        />
        <LabeledInput
          disabled={useDynamicRowHeight}
          label="Row height"
          name="listRowHeight"
          onChange={(event) => setListRowHeight(parseInt(event.target.value, 10) || 1)}
          value={listRowHeight}
        />
        <LabeledInput
          label="Overscan"
          name="overscanRowCount"
          onChange={(event) => setOverscanRowCount(parseInt(event.target.value, 10) || 0)}
          value={overscanRowCount}
        />
      </InputRow>

      <div>
        <AutoSizer disableHeight>
          {({ width }) => (
            <List
              ref="List"
              className={styles.List}
              height={listHeight}
              overscanRowCount={overscanRowCount}
              noRowsRenderer={_noRowsRenderer}
              rowCount={rowCount}
              rowHeight={useDynamicRowHeight ? _getRowHeight : listRowHeight}
              rowRenderer={_rowRenderer}
              scrollToIndex={scrollToIndex}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    </ContentBox>
  );

  // Define the methods as usual
  function _getDatum(index) {
    return list.get(index % list.size);
  }

  function _getRowHeight({ index }) {
    return _getDatum(index).size;
  }

  function _noRowsRenderer() {
    return <div className={styles.noRows}>No rows</div>;
  }

  function _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0;

    setRowCount(rowCount);
  }

  function _onScrollToRowChange(event) {
    let scrollToIndex = Math.min(rowCount - 1, parseInt(event.target.value, 10));

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    setScrollToIndex(scrollToIndex);
  }

  function _rowRenderer({ index, isScrolling, key, style }) {
    if (showScrollingPlaceholder && isScrolling) {
      return (
        <div className={clsx(styles.row, styles.isScrollingPlaceholder)} key={key} style={style}>
          Scrolling...
        </div>
      );
    }

    const datum = _getDatum(index);

    let additionalContent;

    if (useDynamicRowHeight) {
      switch (datum.size) {
        case 75:
          additionalContent = <div>It is medium-sized.</div>;
          break;
        case 100:
          additionalContent = (
            <div>
              It is large-sized.
              <br />
              It has a 3rd row.
            </div>
          );
          break;
      }
    }

    return (
      <div className={styles.row} key={key} style={style}>
        <div
          className={styles.letter}
          style={{
            backgroundColor: datum.color,
          }}
        >
          {datum.name.charAt(0)}
        </div>
        <div>
          <div className={styles.name}>{datum.name}</div>
          <div className={styles.index}>This is row {index}</div>
          {additionalContent}
        </div>
        {useDynamicRowHeight && <span className={styles.height}>{datum.size}px</span>}
      </div>
    );
  }
}


// const TargetDropAera = (props: any) => {
//   const targetBoxes = props.targetBoxes;
//   const setTargetBoxes = props.setTargetBoxes;
//   const id = props.id;

//   const [{ canDrop, isOver }, drop] = useDrop(() => {
//     return {
//       accept: ItemTypes.BOX,
//       drop(item: DragItem, monitor) {
//         const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
//         console.log('Target:item >>', item);
//         console.log('Target:item >>', delta);

//         const left = Math.round(item.left + delta.x);
//         const top = Math.round(item.top + delta.y);

//         console.log('Target:coord', { left, top });

//         const box = document.getElementById('target');
//         const rect = box?.getBoundingClientRect();

//         const x = monitor.getClientOffset()?.x || 0;
//         const y = monitor.getClientOffset()?.y || 0;

//         if (rect) {
//           const relativeX = x - rect.left;
//           const relativeY = y - rect.top;
//           console.log('Target:relative', { relativeX, relativeY });

//           const itemFound = targetBoxes[`${item.id}`];
//           console.log('111111111111111111111111 ', itemFound);

//           if (!itemFound) {
//             console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ', item.id);
//             return setTargetBoxes((prevState: { [key: string]: { top: number; left: number; title: string } }) => ({
//               ...prevState,
//               [item.id]: { top: relativeY, left: relativeX, title: targetBoxes[item.id]?.title },
//             }));
//           }
//         }

//         console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', item.id);
//         setTargetBoxes((prevState: { [key: string]: { top: number; left: number; title: string } }) => ({
//           ...prevState,
//           [item.id]: { top: top, left: left, title: targetBoxes[item.id]?.title },
//         }));

//         // search for the item found
//       },
//       collect: (monitor) => ({
//         isOver: monitor.isOver(),
//         canDrop: monitor.canDrop(),
//       }),
//     };
//   }, [targetBoxes]);

//   return (
//     <Box
//       id="target"
//       ref={drop}
//       sx={{ width: 250, height: 250, border: '5px solid black', position: 'relative', borderColor: isOver ? 'green' : 'black' }}
//       onMouseDown={(event) => {
//         const target = document.getElementById('target');
//         const rect = target?.getBoundingClientRect();
//         const x = event.clientX;
//         const y = event.clientY;

//         if (!rect) return;

//         const relativeX = x - rect?.left;
//         const relativeY = y - rect?.top;

//         console.log('>>>>>>>:relative', { relativeX, relativeY });
//       }}
//     >
//       {Object.keys(targetBoxes).map((key) => {
//         const { left, top, title } = targetBoxes[key] as {
//           top: number;
//           left: number;
//           title: string;
//         };
//         return (
//           <BoxItem key={key} id={key} left={left} top={top} hideSourceOnDrag={false}>
//             {title}
//           </BoxItem>
//         );
//       })}
//     </Box>
//   );
// };