var AssureNote;
(function (AssureNote) {
    var PictgramPanel = (function () {
        function PictgramPanel(AssureNoteApp) {
            var _this = this;
            this.AssureNoteApp = AssureNoteApp;
            this.SVGLayer = (document.getElementById("svg-layer"));
            this.EventMapLayer = (document.getElementById("eventmap-layer"));
            this.ContentLayer = (document.getElementById("content-layer"));
            this.ControlLayer = (document.getElementById("control-layer"));
            this.ViewPort = new AssureNote.ViewportManager(this.SVGLayer, this.EventMapLayer, this.ContentLayer, this.ContentLayer);
            this.LayoutEngine = new AssureNote.SimpleLayoutEngine(this.AssureNoteApp);

            var Bar = new AssureNote.MenuBar(AssureNoteApp);
            this.ContentLayer.onclick = function (event) {
                var Label = AssureNote.AssureNoteUtils.GetNodeLabel(event);
                _this.AssureNoteApp.DebugP("click:" + Label);
                if (Bar.IsEnable) {
                    Bar.Remove();
                }
                var NodeView = _this.ViewMap[Label];
                if (NodeView != null) {
                    _this.FocusedLabel = Label;
                    if (!Bar.IsEnable) {
                        var Buttons = _this.AssureNoteApp.PluginManager.GetMenuBarButtons();
                        Bar.Create(_this.ViewMap[Label], _this.ControlLayer, Buttons);
                    }
                } else {
                    _this.FocusedLabel = null;
                }
                return false;
            };

            //FIXME
            this.EventMapLayer.onclick = function (event) {
                _this.FocusedLabel = null;
                if (Bar.IsEnable) {
                    Bar.Remove();
                }
            };

            this.ContentLayer.ondblclick = function (event) {
                var Label = AssureNote.AssureNoteUtils.GetNodeLabel(event);
                var NodeView = _this.ViewMap[Label];
                _this.AssureNoteApp.DebugP("double click:" + Label);
                return false;
            };

            this.CmdLine = new AssureNote.CommandLine();
            this.Search = new AssureNote.Search(AssureNoteApp);
            document.onkeydown = function (event) {
                if (!_this.AssureNoteApp.PluginPanel.IsVisible) {
                    return;
                }

                switch (event.keyCode) {
                    case 186:
                        _this.CmdLine.Show();
                        break;
                    case 191:
                        _this.CmdLine.Show();
                        break;
                    case 13:
                        if (_this.CmdLine.IsVisible && _this.CmdLine.IsEnable) {
                            var ParsedCommand = new AssureNote.CommandParser();
                            ParsedCommand.Parse(_this.CmdLine.GetValue());
                            if (ParsedCommand.GetMethod() == "search") {
                                _this.Search.Search(_this.MasterView, ParsedCommand.GetArgs()[0]);
                            }
                            _this.AssureNoteApp.ExecCommand(ParsedCommand);
                            _this.CmdLine.Hide();
                            _this.CmdLine.Clear();
                            return false;
                        }
                        break;
                }
            };

            this.ContentLayer.onmouseover = function (event) {
                if (!_this.AssureNoteApp.PluginPanel.IsVisible) {
                    return;
                }
                var Label = AssureNote.AssureNoteUtils.GetNodeLabel(event);
                if (Label) {
                    _this.AssureNoteApp.DebugP("mouseover:" + Label);
                }
            };

            var DragHandler = function (e) {
                if (_this.AssureNoteApp.PluginPanel.IsVisible) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            };
            $(this.EventMapLayer).on('dragenter', DragHandler).on('dragover', DragHandler).on('dragleave', DragHandler).on('drop', function (event) {
                if (_this.AssureNoteApp.PluginPanel.IsVisible) {
                    event.stopPropagation();
                    event.preventDefault();
                    _this.AssureNoteApp.ProcessDroppedFiles(((event.originalEvent).dataTransfer).files);
                    return false;
                }
            });
        }
        PictgramPanel.prototype.SetView = function (NodeView) {
            this.MasterView = NodeView;
            this.ViewMap = {};
            this.MasterView.UpdateViewMap(this.ViewMap);
        };

        PictgramPanel.prototype.DisplayPictgram = function () {
            this.AssureNoteApp.PluginPanel.Clear();
        };

        PictgramPanel.prototype.Draw = function (Label, wx, wy) {
            if (wx == null) {
                wx = window.innerWidth / 2;
            }
            if (wy == null) {
                wy = window.innerHeight / 3;
            }

            var TargetView = this.ViewMap[Label];
            if (TargetView == null) {
                TargetView = this.MasterView;
            }
            this.LayoutEngine.DoLayout(this, TargetView);
            this.ContentLayer.style.display = "none";
            this.SVGLayer.style.display = "none";
            AssureNote.NodeView.SetGlobalPositionCacheEnabled(true);
            TargetView.UpdateDocumentPosition();
            AssureNote.NodeView.SetGlobalPositionCacheEnabled(false);
            this.ContentLayer.style.display = "";
            this.SVGLayer.style.display = "";

            // Do scroll
            this.ViewPort.SetOffset(wx - TargetView.GetShape().GetNodeWidth() / 2, wy - TargetView.GetShape().GetNodeHeight() / 2);
        };

        PictgramPanel.prototype.Redraw = function () {
            this.Draw(this.FocusedLabel, this.FocusedWx, this.FocusedWy);
        };

        PictgramPanel.prototype.DisplayPluginPanel = function (PluginName, Label) {
            var Plugin = this.AssureNoteApp.PluginManager.GetPanelPlugin(PluginName, Label);
            Plugin.Display(this.AssureNoteApp.PluginPanel, this.AssureNoteApp.MasterRecord.GetLatestDoc(), Label);
        };

        //TODO
        PictgramPanel.prototype.NavigateUp = function () {
        };
        PictgramPanel.prototype.NavigateDown = function () {
        };
        PictgramPanel.prototype.NavigateLeft = function () {
        };
        PictgramPanel.prototype.NavigateRight = function () {
        };
        PictgramPanel.prototype.NavigateHome = function () {
        };
        return PictgramPanel;
    })();
    AssureNote.PictgramPanel = PictgramPanel;

    var PluginPanel = (function () {
        function PluginPanel(AssureNoteApp) {
            this.AssureNoteApp = AssureNoteApp;
            this.IsVisible = true;
            var textarea = CodeMirror.fromTextArea(document.getElementById('editor'), {
                lineNumbers: false,
                mode: "text/x-asn",
                lineWrapping: true
            });

            this.FullScreenEditor = new AssureNote.FullScreenEditorPlugin(AssureNoteApp, textarea, '#editor-wrapper');
            AssureNoteApp.PluginManager.SetPlugin("FullScreenEditor", this.FullScreenEditor);
        }
        PluginPanel.prototype.Clear = function () {
        };
        return PluginPanel;
    })();
    AssureNote.PluginPanel = PluginPanel;
})(AssureNote || (AssureNote = {}));
//# sourceMappingURL=Panel.js.map
