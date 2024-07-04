function init() {
    var $ = go.GraphObject.make;  // abreviatura para go.GraphObject.make

    // función para añadir un nodo hijo
    function addChildNode(e, obj) {
        var node = obj.part.adornedPart;  // el nodo al que se le hace clic
        var diagram = node.diagram;
        diagram.startTransaction("add child");

        // contar hijos existentes
        var children = node.findTreeChildrenNodes().count;

        if (children < 2) {
            var newName = prompt("Ingrese el nombre del nuevo nodo:");
            if (newName) {
                var newKey = diagram.model.nodeDataArray.length + 1;
                var newNodeData = { key: newKey, parent: node.data.key, name: newName };
                diagram.model.addNodeData(newNodeData);
            }
        } else {
            alert("No puede añadir más de dos nodos hijos");
        }

        diagram.commitTransaction("add child");
    }

    // define una plantilla de nodo simple con un menú contextual
    myDiagram = $(go.Diagram, "myDiagramDiv",  // debe coincidir con el ID del div en HTML
                  {
                      layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
                  });

    myDiagram.nodeTemplate =
        $(go.Node, "Horizontal",
          { background: "#44CCFF" },
          $(go.TextBlock, "Default Text",
            { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
            new go.Binding("text", "name")),
          {
            contextMenu:  // define un menú contextual para el nodo
              $("ContextMenu",
                $("ContextMenuButton",
                  $(go.TextBlock, "Add Child"),
                  { click: addChildNode })
              )
          }
        );

    // define un modelo de árbol simple
    var model = $(go.TreeModel);
    model.nodeDataArray = [
        { key: "1",              name: "Root" }
    ];
    myDiagram.model = model;
}

window.addEventListener('DOMContentLoaded', init);
