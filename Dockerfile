# https://blog.golang.org/docker

# Start from a Debian image with the latest version of Go installed
# and a workspace (GOPATH) configured at /go.
FROM golang:1.6.1

ENV nbusy_path github.com/nbusy/nbusy

# Copy the local package files to the container's workspace.
ADD . /go/src/${nbusy_path}

# Build the nbusy command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
RUN go get -t -v ${nbusy_path}
RUN go test -v ${nbusy_path}
RUN GORACE="halt_on_error=1" go test -v -race -cover ${nbusy_path}
RUN go install -v ${nbusy_path}

# Run the nbusy command by default when the container starts.
ENTRYPOINT /go/bin/nbusy -run

# Document that the service listens on port 80.
EXPOSE 80
