# https://blog.golang.org/docker

# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang

# Copy the local package files to the container's workspace.
ADD . /go/src/github.com/nbusy/nbusy

# Build the nbusy command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
RUN go get -t -v ./... github.com/nbusy/nbusy
RUN go test -v ./... github.com/nbusy/nbusy
RUN GORACE="halt_on_error=1" go test -v -race -cover ./... github.com/nbusy/nbusy
RUN go install -v ./... github.com/nbusy/nbusy

# Run the nbusy command by default when the container starts.
ENTRYPOINT /go/bin/nbusy -run

# Document that the service listens on port 3000.
EXPOSE 3000
