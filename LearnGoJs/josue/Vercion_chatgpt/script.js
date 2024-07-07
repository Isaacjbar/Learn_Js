const $ = go.GraphObject.make;

let nodeCounter = 1; // Contador global para asignar IDs a los nodos

function init() {
  const myDiagram = $(go.Diagram, "myDiagramDiv", {
    layout: $(go.TreeLayout),
    "undoManager.isEnabled": true,
  });

  // Definir el modelo de datos inicial
  myDiagram.model = new go.GraphLinksModel(
    [{ key: 1, text: 'Node 1', color: 'lightblue', counter: 0 }],
    []
  );

  // Plantilla de nodo personalizada
  myDiagram.nodeTemplate = $(
    go.Node,
    "Auto",
    { locationSpot: go.Spot.Center },
    new go.Binding("location", "location"),
    $(go.Shape, "RoundedRectangle", { fill: "white" },
      new go.Binding("fill", "color"),
      new go.Binding("fill", "isHighlighted", (h, shape) => h ? "darkred" : shape.part.data.color || "white").ofObject()
    ),
    $(go.Panel, "Vertical",
      $(go.TextBlock, { margin: 10, font: "bold 16px sans-serif", width: 140, textAlign: "center" },
        new go.Binding("text", "text")
      ),
      $(go.TextBlock, { margin: 4, font: "bold 12px sans-serif", stroke: "blue" },
        new go.Binding("text", "counter", count => `Counter: ${count || 0}`)
      )
    ),
    {
      doubleClick: function (e, node) {
        if (node.data.counter < 2) {
          const newNodeData = { key: ++nodeCounter, text: `Node ${nodeCounter}`, color: 'lightyellow', counter: 0 };
          myDiagram.model.addNodeData(newNodeData);
          myDiagram.model.addLinkData({ from: node.data.key, to: newNodeData.key });
          incrementCounter(node);
        }
      }
    }
  );

  // Plantilla de enlace personalizada
  myDiagram.linkTemplate = $(
    go.Link,
    $(go.Shape, { isPanelMain: true, strokeWidth: 8, stroke: 'transparent' },
      new go.Binding('stroke', 'isHighlighted', h => h ? 'red' : 'transparent').ofObject()
    ),
    $(go.Shape, { isPanelMain: true, strokeWidth: 3 }, new go.Binding('stroke', 'color')),
    $(go.Shape, { toArrow: 'standard', strokeWidth: 0, scale: 1.5 }, new go.Binding('fill', 'color')),
    {
      mouseEnter: (e, link) => (link.isHighlighted = true),
      mouseLeave: (e, link) => (link.isHighlighted = false),
    }
  );

  // Función para incrementar el contador de un nodo
  function incrementCounter(node) {
    const model = myDiagram.model;
    const data = node.data;
    model.setDataProperty(data, 'counter', (data.counter || 0) + 1);
    if (data.counter >= 2) {
      // Desactivar la capacidad de agregar más nodos a este nodo
      node.isTreeLeaf = true;
    }
  }

  // Función para actualizar el contador global en el HTML
  function updateGlobalCounter() {
    const totalNodes = myDiagram.nodes.count;
    document.getElementById('globalCounter').textContent = `Total Nodes: ${totalNodes}`;
  }

  // Inicializar el diagrama y actualizar el contador global
  updateGlobalCounter();
}

// Iniciar la aplicación
init();
