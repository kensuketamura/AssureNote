///<reference path='SideMenu.ts'/>
///<reference path='Socket.ts'/>
///<reference path='Command.ts'/>
var AssureNote;
(function (AssureNote) {
    var AssureNoteApp = (function () {
        function AssureNoteApp() {
            this.PluginManager = new AssureNote.PluginManager(this);
            this.SocketManager = new AssureNote.SocketManager(this);
            this.PictgramPanel = new AssureNote.PictgramPanel(this);
            this.PluginPanel = new AssureNote.PluginPanel(this);
            this.Commands = {};

            this.DefaultCommand = new AssureNote.CommandMissingCommand(this);
            this.RegistCommand(new AssureNote.SaveCommand(this));
            this.RegistCommand(new AssureNote.OpenCommand(this));
            this.RegistCommand(new AssureNote.NewCommand(this));
            this.RegistCommand(new AssureNote.UnfoldAllCommand(this));
            this.RegistCommand(new AssureNote.SetColorCommand(this));
            this.RegistCommand(new AssureNote.SetScaleCommand(this));
        }
        AssureNoteApp.prototype.RegistCommand = function (Command) {
            var Names = Command.GetCommandLineNames();
            for (var i = 0; i < Names.length; ++i) {
                this.Commands[Names[i]] = Command;
            }
        };

        // Deprecated
        AssureNoteApp.prototype.DebugP = function (Message) {
            console.log(Message);
        };

        AssureNoteApp.Assert = function (b, message) {
            if (b == false) {
                console.log("Assert: " + message);
                throw "Assert: " + message;
            }
        };

        AssureNoteApp.prototype.ExecDoubleClicked = function (NodeView) {
            var Plugin = this.PluginManager.GetDoubleClicked();
            Plugin.ExecDoubleClicked(NodeView);
        };

        AssureNoteApp.prototype.FindCommandByCommandLineName = function (Name) {
            return this.Commands[Name] || this.DefaultCommand;
        };

        AssureNoteApp.prototype.ExecCommand = function (ParsedCommand) {
            var CommandName = ParsedCommand.GetMethod();
            if (CommandName == "search") {
                return;
            }

            var Command = this.FindCommandByCommandLineName(CommandName);
            Command.Invoke(this.PictgramPanel.GetFocusedView(), ParsedCommand.GetArgs());
            //var BuiltinCommand = this.Commands.GetFunction(MethodName);
            //if (BuiltinCommand != null) {
            //	BuiltinCommand(this, ParsedCommand.GetArgs());
            //	return;
            //}
            //var Plugin = this.PluginManager.GetCommandPlugin(MethodName);
            //if (Plugin != null) {
            //	Plugin.ExecCommand(this, ParsedCommand.GetArgs());
            //} else {
            //    //TODO split jump-node function
            //	var Label = MethodName.toUpperCase();
            //	if (this.PictgramPanel.ViewMap == null) {
            //		this.DebugP("Jump is diabled.");
            //		return;
            //	}
            //    var Node = this.PictgramPanel.ViewMap[Label];
            //    if (MethodName == "" && Node == null) {
            //        Label = this.PictgramPanel.FocusedLabel;
            //        Node = this.PictgramPanel.ViewMap[Label];
            //    }
            //    if (Node != null) {
            //        if ($("#" + Label.replace(/\./g,"\\.")).length > 0) { //FIXME use IsVisible
            //            this.PictgramPanel.Viewport.SetCaseCenter(Node.GetCenterGX(), Node.GetCenterGY());
            //        } else {
            //            this.DebugP("Invisible node " + Label + " Selected.");
            //        }
            //        return;
            //    }
            //	this.DebugP("undefined command: " + MethodName);
            //}
        };

        AssureNoteApp.prototype.LoadNewWGSN = function (Name, WGSN) {
            this.WGSNName = Name;
            this.MasterRecord = new GSNRecord();
            this.MasterRecord.Parse(WGSN);

            var LatestDoc = this.MasterRecord.GetLatestDoc();
            var TopGoalNode = LatestDoc.TopGoal;

            this.PictgramPanel.SetView(new AssureNote.NodeView(TopGoalNode, true));
            this.PictgramPanel.SetFoldedAllGoalNode(this.PictgramPanel.MasterView);

            this.PictgramPanel.Draw();

            var Shape = this.PictgramPanel.MasterView.GetShape();
            var WX = window.innerWidth / 2 - Shape.GetNodeWidth() / 2;
            var WY = window.innerHeight / 3 - Shape.GetNodeHeight() / 2;
            this.PictgramPanel.Viewport.SetScale(1);
            this.PictgramPanel.Viewport.SetOffset(WX, WY);
        };

        AssureNoteApp.prototype.ProcessDroppedFiles = function (Files) {
            var _this = this;
            if (Files[0]) {
                var reader = new FileReader();
                reader.onerror = function (event) {
                    console.log('error', (event.target).error.code);
                };

                reader.onload = function (event) {
                    var Contents = (event.target).result;
                    var Name = Files[0].name;
                    _this.LoadNewWGSN(Name, Contents);

                    /* TODO resolve conflict */
                    _this.SocketManager.UpdateWGSN();
                };
                reader.readAsText(Files[0], 'utf-8');
            }
        };
        return AssureNoteApp;
    })();
    AssureNote.AssureNoteApp = AssureNoteApp;
})(AssureNote || (AssureNote = {}));
//# sourceMappingURL=AssureNote.js.map
