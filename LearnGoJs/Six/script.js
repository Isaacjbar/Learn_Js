function init() {
    var $ = go.GraphObject.make;  // abreviatura para go.GraphObject.make

    var currentNode;  // Variable para guardar el nodo actual

    // función para añadir dos nodos hijos
    function addChildNodes(e, obj) {
        var node = obj.part.adornedPart;  // el nodo al que se le hace clic
        var diagram = node.diagram;
        diagram.startTransaction("add children");

        // contar hijos existentes
        var children = node.findTreeChildrenNodes().count;

        if (children < 2) {
            for (var i = 0; i < 2; i++) {
                var newKey = diagram.model.nodeDataArray.length + 1;
                var newNodeData = { key: newKey, parent: node.data.key, title: newKey };
                diagram.model.addNodeData(newNodeData);
            }
        } else {
            alert("No puede añadir más de dos nodos hijos");
        }

        diagram.commitTransaction("add children");
    }

    function showForm(e, obj) {
        currentNode = obj.part.adornedPart;  // el nodo al que se le hace clic
        document.getElementById('myOverlay').style.display = 'flex';
        document.getElementById('nodeName').value = currentNode.data.title || '';
        document.getElementById('nodeDesc').value = currentNode.data.description || '';
        document.getElementById('imagenURL').value = currentNode.data.imagenURL || '';
        document.getElementById('audioURL').value = currentNode.data.audioURL || '';
        document.getElementById('videoURL').value = currentNode.data.videoURL || '';
        document.getElementById('errorMensaje').style.display = 'none';
        myDiagram.div.style.pointerEvents = 'none'; // Disable interactions with the diagram
    }

    // función para guardar los datos del formulario
    function saveForm() {
        var nodeName = document.getElementById('nodeName').value;
        var nodeDesc = document.getElementById('nodeDesc').value;
        var imagenURL = document.getElementById('imagenURL').value;
        var audioURL = document.getElementById('audioURL').value;
        var videoURL = document.getElementById('videoURL').value;

        if ((videoURL && (imagenURL || audioURL)) || (!videoURL && !imagenURL && !audioURL)) {
            document.getElementById('errorMensaje').style.display = 'block';
            return;
        }

        var diagram = currentNode.diagram;
        diagram.startTransaction("save form");
        diagram.model.setDataProperty(currentNode.data, "title", nodeName);
        diagram.model.setDataProperty(currentNode.data, "description", nodeDesc);
        diagram.model.setDataProperty(currentNode.data, "imagenURL", imagenURL);
        diagram.model.setDataProperty(currentNode.data, "audioURL", audioURL);
        diagram.model.setDataProperty(currentNode.data, "videoURL", videoURL);
        diagram.commitTransaction("save form");
        hideForm();
    }

    // función para cancelar el formulario
    function cancelForm() {
        hideForm();
    }

    // función para ocultar el formulario y mostrar el diagrama
    function hideForm() {
        document.getElementById('myOverlay').style.display = 'none';
        myDiagram.div.style.pointerEvents = 'auto'; // Re-enable interactions with the diagram
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

    // Función para eliminar una escena hermana
    function deleteSceneBro(node) {
        var parentNode = node.findTreeParentNode();
        if (parentNode) {
            var siblings = parentNode.findTreeChildrenNodes();
            siblings.each(function(sibling) {
                if (sibling.data.key !== node.data.key) {
                    myDiagram.startTransaction("deleteSibling");
                    deleteSubTree(sibling);
                    myDiagram.model.removeNodeData(sibling.data);
                    myDiagram.commitTransaction("deleteSibling");
                }
            });
        }
    }

    // Función para borrar un nodo, su subárbol y la escena hermana
    function deleteNodeAndSubTreeAndBro(node) {
        // Mostrar advertencia si el nodo tiene hijos
        var confirmation = confirm("Si eliminas esta escena, se eliminará la escena hermana y todas las escenas hijas. ¿Quieres continuar?");
        if (!confirmation) return;

        // Eliminar el nodo, su subárbol y la escena hermana
        var diagram = node.diagram;
        diagram.startTransaction("delete node");
        deleteSceneBro(node);
        deleteSubTree(node);
        myDiagram.model.removeNodeData(node.data); // Eliminar el nodo actual
        diagram.commitTransaction("delete node");
    }

    // Función para mostrar el menú contextual
    function showContextMenu(e, obj) {
        var node = obj.part;
        node.diagram.toolManager.contextMenuTool.showContextMenu(node, e.diagram.lastInput.viewPoint);
    }

    // Función para verificar si es un enlace de YouTube
    function isYouTubeURL(url) {
        return url.includes("youtube.com/embed/");
    }

    // Función para crear un iframe de YouTube embebido
    function createYouTubeHTML(url) {
        return "<iframe width='230' height='150' src='" + url + "' frameborder='0' allowfullscreen></iframe>";
    }

    var youtubeTemplate = $(go.HTMLInfo, {
        show: function (div, obj) {
            var url = obj.part.data.videoURL;
            if (isYouTubeURL(url)) {
                div.innerHTML = createYouTubeHTML(url);
            }
        },
        hide: function (div, obj) {
            div.innerHTML = "";
        }
    });

    // define una plantilla de nodo simple con un menú contextual
    myDiagram = $(go.Diagram, "myDiagramDiv",  // debe coincidir con el ID del div en HTML
        {
            layout: $(go.TreeLayout, { angle: 90, layerSpacing: 35 })
        });

    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            {
                click: showContextMenu // Mostrar menú contextual con un solo clic
            },
            $(go.Shape, "RoundedRectangle",
                {
                    fill: $(go.Brush, "Linear", { 0: "#0A7890", 1: "#0B8884" }),  // Gradient color
                    stroke: null,
                    width: 250,  // Ajustar ancho según sea necesario
                    height: 250, // Ajustar altura según sea necesario
                    figure: "RoundedRectangle",
                    parameter1: 10, // corner radius
                }),
            $(go.Panel, "Vertical",
                $(go.TextBlock, "Default Text",
                    {
                        margin: 12,
                        stroke: "white",
                        font: "14px Arial",
                        textAlign: "center",
                        wrap: go.TextBlock.WrapFit,
                        width: 230 // Ajustar ancho según sea necesario
                    },
                    new go.Binding("text", "title")),
                $(go.TextBlock, "",
                    {
                        margin: 12,
                        stroke: "white",
                        font: "12px Arial",
                        textAlign: "center",
                        wrap: go.TextBlock.WrapFit,
                        width: 230 // Ajustar ancho según sea necesario
                    },
                    new go.Binding("text", "description")),
                $(go.Picture,
                    {
                        width: 150, height: 150,  // Ajustar tamaño de la imagen según sea necesario
                        visible: false
                    },
                    new go.Binding("source", "imagenURL"),
                    new go.Binding("visible", "imagenURL", function(url) { return url ? true : false; })),
                $(go.TextBlock,
                    {
                        margin: 12,
                        stroke: "white",
                        font: "12px Arial",
                        textAlign: "center",
                        wrap: go.TextBlock.WrapFit,
                        width: 230 // Ajustar ancho según sea necesario
                    },
                    new go.Binding("text", "audioURL"),
                    new go.Binding("visible", "audioURL", function(url) { return url ? true : false; })),
                {
                    toolTip: youtubeTemplate
                }
            ),
            {
                contextMenu:  // define un menú contextual para el nodo
                    $("ContextMenu",
                        $("ContextMenuButton",
                            $(go.TextBlock, "Añadir escenas"),
                            { click: addChildNodes }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Formulario"),
                            { click: showForm }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Eliminar Nodo"),
                            {
                                click: function(e, obj) {
                                    var node = obj.part.adornedPart;
                                    deleteNodeAndSubTreeAndBro(node); // Llamar a la función de borrado
                                }
                            })
                    )
            }
        );

    // define un modelo de árbol simple
    var model = $(go.TreeModel);
    model.nodeDataArray = [
        { key: "1", title: "A", description: "Proyecto integrador" }
    ];
    myDiagram.model = model;

    // Exponer las funciones saveForm y cancelForm globalmente
    window.saveForm = saveForm;
    window.cancelForm = cancelForm;
}

window.addEventListener('DOMContentLoaded', init);
