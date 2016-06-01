# https://blog.golang.org/docker

# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang:1.6.2

ENV titan_path github.com/titan-x/titan

# Copy the local package files to the container's workspace.
ADD . /go/src/${titan_path}

# Build the titan command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
RUN go get -t -v ${titan_path}
RUN go test -v ${titan_path}
RUN GORACE="halt_on_error=1" go test -v -race -cover ${titan_path}
RUN go install -v ${titan_path}/cmd/titan

# Run the titan command by default when the container starts.
ENTRYPOINT /go/bin/titan -run

# Document that the service listens on port 80.
EXPOSE 80
