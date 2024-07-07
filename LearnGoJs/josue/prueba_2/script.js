const d = document, w = window, c = console;
let nodeCounter = 1; // Initialize a counter for nodes

function init() {
  let dragged = null; // A reference to the element currently being dragged

  // Crear y agregar el contenedor del contador global al documento
  const globalCounterContainer = document.createElement('div');
  globalCounterContainer.id = 'globalCounterContainer';
  globalCounterContainer.style.position = 'fixed';
  globalCounterContainer.style.top = '10px';
  globalCounterContainer.style.right = '10px';
  globalCounterContainer.style.backgroundColor = 'white';
  globalCounterContainer.style.padding = '10px';
  globalCounterContainer.style.border = '1px solid black';
  globalCounterContainer.innerHTML = `Total Nodes: ${nodeCounter}`;
  document.body.appendChild(globalCounterContainer);

  function updateGlobalCounter() {
    globalCounterContainer.innerHTML = `Total Nodes: ${nodeCounter}`;
  }

  // Para agarrar cualquier elemento con la clase draggable
  document.addEventListener(
    'dragstart',
    (event) => {
      if (event.target.className !== 'draggable') return;
      event.dataTransfer.setData('text', event.target.textContent);
      dragged = event.target;
      dragged.offsetX = event.offsetX - dragged.clientWidth / 2;
      dragged.offsetY = event.offsetY - dragged.clientHeight / 2;
      event.target.style.border = '2px solid darkblue';
    },
    false
  );

  document.addEventListener(
    'dragend',
    (event) => {
      dragged.style.border = '';
      onHighlight(null);
    },
    false
  );

  const div = document.getElementById('myDiagramDiv');

  div.addEventListener(
    'dragenter',
    (event) => {
      event.preventDefault();
    },
    false
  );

  div.addEventListener(
    'dragover',
    (event) => {
      if (div === myDiagram.div) {
        const can = event.target;
        const pixelratio = myDiagram.computePixelRatio();

        if (!(can instanceof HTMLCanvasElement)) return;

        const bbox = can.getBoundingClientRect();
        let bbw = bbox.width;
        if (bbw === 0) bbw = 0.001;
        let bbh = bbox.height;
        if (bbh === 0) bbh = 0.001;
        const mx = event.clientX - bbox.left * (can.width / pixelratio / bbw);
        const my = event.clientY - bbox.top * (can.height / pixelratio / bbh);
        const point = myDiagram.transformViewToDoc(new go.Point(mx, my));
        const part = myDiagram.findPartAt(point, true);
        onHighlight(part);
      }

      if (event.target.className === 'dropzone') {
        return;
      }

      event.preventDefault();
    },
    false
  );

  div.addEventListener(
    'dragleave',
    (event) => {
      if (event.target.className == 'dropzone') {
        event.target.style.background = '';
      }
      onHighlight(null);
    },
    false
  );

  div.addEventListener(
    'drop',
    (event) => {
      event.preventDefault();
      if (div === myDiagram.div) {
        const can = event.target;
        const pixelratio = myDiagram.computePixelRatio();

        if (!(can instanceof HTMLCanvasElement)) return;

        const bbox = can.getBoundingClientRect();
        let bbw = bbox.width;
        if (bbw === 0) bbw = 0.001;
        let bbh = bbox.height;
        if (bbh === 0) bbh = 0.001;
        const mx = event.clientX - bbox.left * (can.width / pixelratio / bbw);
        const my = event.clientY - bbox.top * (can.height / pixelratio / bbh);
        const point = myDiagram.transformViewToDoc(new go.Point(mx, my));

        myDiagram.startTransaction('new node');
        const newdata = {
          key: nodeCounter, // Use the global node counter
          location: myDiagram.transformViewToDoc(
            new go.Point(mx - dragged.offsetX, my - dragged.offsetY)
          ),
          text: `Node ${nodeCounter}`, // Use the global node counter in the text
          color: 'green',
        };
        myDiagram.model.addNodeData(newdata);
        const newnode = myDiagram.findNodeForData(newdata);
        if (newnode) {
          newnode.ensureBounds();
          myDiagram.select(newnode);
          onDrop(newnode, point);
        }
        nodeCounter++;
        updateGlobalCounter(); // Update the global counter display
        myDiagram.commitTransaction('new node');
      }
    },
    false
  );

  function onHighlight(part) {
    const oldskips = myDiagram.skipsUndoManager;
    myDiagram.skipsUndoManager = true;
    myDiagram.startTransaction('highlight');
    if (part !== null) {
      myDiagram.highlight(part);
    } else {
      myDiagram.clearHighlighteds();
    }
    myDiagram.commitTransaction('highlight');
    myDiagram.skipsUndoManager = oldskips;
  }

  function onDrop(newNode, point) {
    const it = myDiagram.findPartsAt(point).iterator;
    while (it.next()) {
      const part = it.value;
      if (part === newNode) continue;
      if (part && part.mouseDrop) {
        const e = new go.InputEvent();
        e.diagram = myDiagram;
        e.documentPoint = point;
        e.viewPoint = myDiagram.transformDocToView(point);
        e.up = true;
        myDiagram.lastInput = e;
        part.mouseDrop(e, part);
        return;
      }
    }
  }

  const $ = go.GraphObject.make;
  const myDiagram = new go.Diagram(
    'myDiagramDiv',
    {
      layout: $(go.TreeLayout),
      'undoManager.isEnabled': true,
    }
  );

  myDiagram.nodeTemplate = 
    $(go.Node,'Auto',
      { locationSpot: go.Spot.Center },
      new go.Binding('location'),
      $(go.Shape,
        { fill: 'white' },
        'RoundedRectangle',
        new go.Binding('fill', 'color'),
        new go.Binding('fill', 'isHighlighted', (h, shape) => {
          if (h) return 'darkred';
          const c = shape.part.data.color;
          return c ? c : 'white';
        }).ofObject()
      ),
      $(go.Panel, 'Vertical',
        $(go.TextBlock,
          { margin: 10, font: 'bold 16px sans-serif', width: 140, textAlign: 'center' },
          new go.Binding('text')
        ),
        $(go.TextBlock,
          { margin: 4, font: 'bold 12px sans-serif', stroke: 'blue' },
          new go.Binding('text', 'key', (key) => `Counter: ${key}`) // Display the individual counter
        )
      ),
      {
        doubleClick: function(e, node){
          const $body = d.getElementById("body");
          const $decitionformContainer = document.createElement('div');
          $decitionformContainer.setAttribute("class","decitionformContainer")
          $decitionformContainer.innerHTML = `
            <form>
            <h3>Agregar decisión</h3>
            <label for="decitionText">Ingresa el texto de la decisión:</label>
            <br>
            <textarea name="decitionText" id="decitionText"></textarea>
            <br>
            <label for="mmType">Selecciona el tipo de mutlimedia:</label>
            <select name="mmType" onChange="showMmInput(this)">
            <option value="tipo">Tipo</option>
            <option value="image">Imagen</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="text">Texto</option>
          </select>
          <br>
            <div id="mmInputContainer"></div>
            <button id="btn_close_form" type="button" onclick="closeForm(this.parentNode.parentNode)">Close</button>
            <input type="submit" name="submitDecition" value="Agregar decisión">
            </form>
          `;
          $body.appendChild($decitionformContainer);
        } 
      },
      {
        mouseDragEnter: (e, node) => (node.isHighlighted = true),
        mouseDragLeave: (e, node) => (node.isHighlighted = false),
        mouseDrop: (e, node) => {
          const newnode = e.diagram.selection.first();
          if (!mayConnect(node, newnode)) return;
          const incoming = newnode.findLinksInto().first();
          if (incoming) e.diagram.remove(incoming);
          e.diagram.model.addLinkData({ from: node.key, to: newnode.key });
        },
      },
    );

  myDiagram.linkTemplate = $(
    go.Link,
    $(
      go.Shape,
      { isPanelMain: true, strokeWidth: 8, stroke: 'transparent' },
      new go.Binding('stroke', 'isHighlighted', (h) => (h ? 'red' : 'transparent')).ofObject()
    ),
    $(go.Shape, { isPanelMain: true, strokeWidth: 3 }, new go.Binding('stroke', 'color')),
    $(go.Shape, { toArrow: 'standard', strokeWidth: 0, scale: 1.5 }, new go.Binding('fill', 'color')),
    {
      mouseEnter: (e, link) => (link.isHighlighted = true),
      mouseLeave: (e, link) => (link.isHighlighted = false),
    }
  );

  myDiagram.toolManager.linkingTool.linkValidation = myDiagram.toolManager.relinkingTool.linkValidation = mayConnect;

  function mayConnect(node1, node2) {
    if (!(node1 instanceof go.Node)) return false;
    if (node1 === node2) return false;
    return true;
  }

  myDiagram.commandHandler.doKeyDown = function() {
    if (
      myDiagram.lastInput.copyKey &&
      (myDiagram.lastInput.key === 'V' || myDiagram.lastInput.key === String.fromCharCode(0xF) || myDiagram.lastInput.key === String.fromCharCode(0x16) || myDiagram.lastInput.key === 'Insert') &&
      myDiagram.commandHandler.canPasteSelection()
    ) {
      myDiagram.commandHandler.pasteSelection(myDiagram.lastInput.documentPoint);
    } else {
      go.CommandHandler.prototype.doKeyDown.call(this);
    }
  };

  myDiagram.addDiagramListener('SelectionDeleted', (e) => {
    e.subject.each((part) => {
      if (!(part instanceof go.Node)) return;
      if (part.data.key !== undefined) nodeCounter--;
      updateGlobalCounter(); // Update the global counter display
    });
  });

  myDiagram.model = new go.GraphLinksModel(
    [{ key: nodeCounter, text: 'Hello, world!', color: 'green' }],
    [{ from: 0, to: 1 }]
  );
}

init();
