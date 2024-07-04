function init() {
    var $ = go.GraphObject.make;  // abreviatura para go.GraphObject.make

    // Función para generar la nueva clave (key)
    function generateKey(parentKey) {
        let lastChar = parentKey.slice(-1);  // último carácter de la clave del padre
        let prefix = parentKey.slice(0, -1); // prefijo de la clave del padre (sin el último carácter)
        let newKey;

        if (isNaN(lastChar)) {  // Si el último carácter no es un número (es una letra)
            newKey = parentKey + "1";  // Añadir "1" al final
        } else {  // Si el último carácter es un número
            // Extraer el número actual como entero
            let num = parseInt(lastChar);

            // Incrementar el número y convertirlo de nuevo a carácter
            let nextNum = num + 1;
            newKey = prefix + nextNum.toString();
        }
        return newKey;
    }

    // Función para añadir un nodo hijo
    function addChildNode(e, obj) {
        var node = obj.part.adornedPart;  // el nodo al que se le hace clic
        var diagram = node.diagram;
        diagram.startTransaction("add child");

        // contar hijos existentes
        var children = node.findTreeChildrenNodes().count;

        if (children < 2) {
            var newName = prompt("Ingrese el nombre del nuevo nodo:");
            if (newName) {
                var newKey = generateKey(node.data.key);
                var newNodeData = { key: newKey, parent: node.data.key, name: newName };
                diagram.model.addNodeData(newNodeData);
            }
        } else {
            alert("No puede añadir más de dos nodos hijos");
        }

        diagram.commitTransaction("add child");
    }

    // Define una plantilla de nodo simple con un menú contextual
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
            contextMenu:  // Define un menú contextual para el nodo
              $("ContextMenu",
                $("ContextMenuButton",
                  $(go.TextBlock, "Add Child"),
                  { click: addChildNode })
              )
          }
        );

    // Define un modelo de árbol simple
    var model = $(go.TreeModel);
    model.nodeDataArray = [
        { key: "A",              name: "Root" },
        { key: "A1", parent: "A", name: "Child 1" },
        { key: "A2", parent: "A", name: "Child 2" },
        { key: "A1A", parent: "A1", name: "Grandchild 1" },
        { key: "A1B", parent: "A1", name: "Grandchild 2" }
    ];
    myDiagram.model = model;
}

window.addEventListener('DOMContentLoaded', init);
