# Data Preprocessing

If you want to generate the visualization data by yourself, please follow the instructions below.

## Current version Code author

1. Aamod Khatiwada
1. Zixuan Chen

## Original Code author

Joe Sackett

## Installation

These components should be installed:
* JDK 1.8
* Hadoop 3.2.1
* Maven
* AWS CLI (for EMR execution)

## Environment

### Example ~/.bashrc:

	export HADOOP_HOME=/home/forhadoop/hadoop-3.2.1
	export HADOOP_INSTALL=$HADOOP_HOME
	export HADOOP_MAPRED_HOME=$HADOOP_HOME
	export HADOOP_COMMON_HOME=$HADOOP_HOME
	export HADOOP_HDFS_HOME=$HADOOP_HOME
	export YARN_HOME=$HADOOP_HOME
	export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
	export PATH=$PATH:$HADOOP_HOME/sbin:$HADOOP_HOME/bin
	export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib/native"
	export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64


### Explicitly set JAVA_HOME and HADOOP_CONF_DIR in $HADOOP_HOME/etc/hadoop/hadoop-env.sh:
	export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64
	export HADOOP_CONF_DIR=${HADOOP_HOME}/etc/hadoop

## Execution

All of the build & execution commands are organized in the Makefile.
1. Download preprocess directory in the root repo.
1. Open command prompt.
1. Navigate to the downloaded directory.
1. Edit the Makefile to customize the environment at the top.
	Sufficient for standalone: hadoop.root, jar.name, local.input <br>
	Other defaults acceptable for running standalone.
1. Standalone Hadoop: <br>
	make switch-standalone		-- set standalone Hadoop environment (execute once) <br>
	make local
1. Pseudo-Distributed Hadoop: (https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/SingleCluster.html#Pseudo-Distributed_Operation) <br>
	make switch-pseudo			-- set pseudo-clustered Hadoop environment (execute once) <br>
	make pseudo					-- first execution <br>
	make pseudoq				-- later executions since namenode and datanode already running <br> 
1. AWS EMR Hadoop: (you must configure the emr.* config parameters at top of Makefile) <br>
	make upload-input-aws		-- only before first execution <br>
	make aws					-- check for successful execution with web interface (aws.amazon.com) <br>
	download-output-aws			-- after successful execution & termination <br>
1. Navigate to output/step2 directory and find the preprocessed file named part-r-*
1. Manually add the header row: Node1, Node2, Node3, Node4, Weight1, Weight2, Weight3.
1. Rename file to data.csv and copy to the data folder in the root directory of repo.