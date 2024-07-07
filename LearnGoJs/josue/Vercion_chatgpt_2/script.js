const $ = go.GraphObject.make;

let nodeCounter = 1; // Contador global para asignar IDs a los nodos

function init() {
  const myDiagram = $(go.Diagram, "myDiagramDiv", {
    layout: $(go.TreeLayout),
    "undoManager.isEnabled": true,
    "ModelChanged": updateGlobalCounter, // Actualiza el contador global cuando el modelo cambia
    "commandHandler.deletesTree": false // Desactivar borrado de nodos con teclado
  });

  // Desactivar eliminación de nodos con la tecla Supr
  myDiagram.commandHandler.deleteSelection = function() {};

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
      ),
      $("Button", 
        { margin: 4, width: 80, height: 25 },
        $(go.TextBlock, "Add Node"),
        {
          click: function (e, button) {
            const node = button.part;
            if (node.data.counter < 2) {
              const newNodeData = { key: ++nodeCounter, text: `Node ${nodeCounter}`, color: 'lightyellow', counter: 0 };
              myDiagram.model.addNodeData(newNodeData);
              myDiagram.model.addLinkData({ from: node.data.key, to: newNodeData.key });
              incrementCounter(node);
            }
          }
        }
      ),
      // Botón para borrar nodo (no se muestra en el nodo inicial)
      $(go.Panel, "Horizontal",
        new go.Binding("visible", "key", key => key !== 1).ofObject(),
        $("Button",
          { margin: 4, width: 80, height: 25 },
          $(go.TextBlock, "Delete Node"),
          {
            click: function (e, button) {
              const node = button.part;
              const childNodes = node.findTreeChildrenNodes();
              if (childNodes.count > 0) {
                const confirmation = confirm("Este nodo tiene nodos conectados. ¿Desea eliminar todos los nodos conectados?");
                if (!confirmation) return;
              }
              const parentNode = node.findTreeParentNode();
              if (parentNode) {
                decrementCounter(parentNode);
              }
              deleteSubTree(node);
            }
          }
        )
      )
    )
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

  // Función para decrementar el contador de un nodo
  function decrementCounter(node) {
    const model = myDiagram.model;
    const data = node.data;
    model.setDataProperty(data, 'counter', (data.counter || 0) - 1);
    if (data.counter < 2) {
      // Reactivar la capacidad de agregar más nodos a este nodo
      node.isTreeLeaf = false;
    }
  }

  // Función para eliminar un subárbol
  function deleteSubTree(node) {
    const nodesToDelete = [];
    const linksToDelete = [];
    
    node.findTreeParts().each(part => {
      if (part instanceof go.Node) {
        nodesToDelete.push(part);
      } else if (part instanceof go.Link) {
        linksToDelete.push(part);
      }
    });

    myDiagram.startTransaction("deleteSubTree");
    linksToDelete.forEach(link => myDiagram.remove(link));
    nodesToDelete.forEach(n => myDiagram.remove(n));
    myDiagram.commitTransaction("deleteSubTree");
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
