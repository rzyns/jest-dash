SHELL = /bin/bash
.ONESHELL:

DOCSET = Jest.docset
CONTENTS = $(DOCSET)/Contents
RESOURCES = $(CONTENTS)/Resources
DOCUMENTS = $(RESOURCES)/Documents

.PHONY: all
all: indexedFiles.json $(RESOURCES)/Documents/jestjs.io $(RESOURCES)/docSet.dsidx $(CONTENTS)/info.plist

$(DOCUMENTS)/jestjs.io: $(DOCUMENTS)
	wget -m -p -E -k \
		--directory-prefix=$(DOCUMENTS) \
		-np https://jestjs.io/docs/en/getting-started \
	|| true

$(DOCUMENTS):
	mkdir -p Jest.docset/Contents/Resources/Documents

$(RESOURCES)/docSet.dsidx: $(DOCUMENTS)
	cd Jest.docset/Contents/Resources
	sqlite3 docSet.dsidx 'CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)'
	sqlite3 docSet.dsidx 'CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path)'

indexedFiles.json: $(DOCUMENTS)/jestjs.io $(RESOURCES)/docSet.dsidx
	@echo "Create data file from base index page"
	npx --no-install ts-node src/createSectionJSON.ts

	@echo "Changing the documentation markup layout a bit to fit dash's small window"
	npx --no-install ts-node src/modifyDocsHTML.ts

	@echo "Reading the previously fetched doc site and parse it into sqlite..."
	npx --no-install ts-node src/index.ts

$(CONTENTS): $(DOCUMENTS)
$(CONTENTS)/info.plist: $(CONTENTS)
	cat > $@ <<- EOF
		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
		<plist version="1.0">
		<dict>
		    <key>CFBundleIdentifier</key>
		    <string>jest</string>
		    <key>CFBundleName</key>
		    <string>Jest</string>
		    <key>DocSetPlatformFamily</key>
		    <string>jest</string>
		    <key>isDashDocset</key>
		    <true/>
		</dict>
		</plist>
	EOF

# Create gzip bundle for Dash Contribution
# tar --exclude='.DS_Store' -cvzf Jest.tgz Jest.docset

.PHONY: clean
clean:
	rm -rf Jest.docset