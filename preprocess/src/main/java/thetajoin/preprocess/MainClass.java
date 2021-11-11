package thetajoin.preprocess;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.conf.Configured;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.MultipleInputs;
import org.apache.hadoop.mapreduce.lib.input.TextInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import org.apache.hadoop.util.Tool;
import org.apache.hadoop.util.ToolRunner;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;


public class MainClass extends Configured implements Tool
{
private static final Logger logger = LogManager.getLogger(MainClass.class);

public static class MapperFirst extends Mapper<Object, Text, Text, Text> 
{
		
		private final Text mapkeyS = new Text();
		private final Text mapvalueS = new Text();
		private final Text mapkeyT = new Text();
		private final Text mapvalueT = new Text();
		
		
		@Override
		public void map(final Object key, final Text value, final Context context) throws IOException, InterruptedException {
			String follower[] = (value.toString()).split(",");
			
			mapkeyT.set(follower[1]);
			mapvalueT.set("t"+follower[0]+"_"+follower[2]);
			mapkeyS.set(follower[0]);
			// Flag this record for the reducer and then output
			mapvalueS.set("s"+follower[1]+"_"+follower[2]);
			context.write(mapkeyT,mapvalueT);
			context.write(mapkeyS,mapvalueS);
			
			

			
		}
}


public static class MapperSecond extends Mapper<Object, Text, Text, Text> 
{
		
		private final Text mapkeyS = new Text();
		private final Text mapvalueS = new Text();
		@Override
		public void map(final Object key, final Text value, final Context context) throws IOException, InterruptedException {
			//node1,node2,node3,score1,score2
			String follower[] = (value.toString()).split(",");
			//node3 is the key for join
			mapkeyS.set(follower[2]);
			// Flag this record for the reducer and then output
			mapvalueS.set("s"+follower[0]+"_"+follower[1]+"_"+follower[3]+"_"+follower[4]);
			context.write(mapkeyS,mapvalueS);
			//node1,node2, score1, score2
			
		}
}

//Mapper second is for second level join to emit tuples from the original dataset.

public static class MapperThird extends Mapper<Object, Text, Text, Text> 
{
		
		private final Text mapkeyT = new Text();
		private final Text mapvalueT = new Text();
		@Override
		public void map(final Object key, final Text value, final Context context) throws IOException, InterruptedException {
			String follower[] = (value.toString()).split(",");
			
			mapkeyT.set(follower[0]);
			// Flag this record for the reducer and then output
			mapvalueT.set("t"+follower[1]+"_"+follower[2]);
			context.write(mapkeyT,mapvalueT);
			//node3,node4,score3
			
			

			
		}
}


public static class ReducerFirst extends Reducer<Text, Text, Text, Text> 
{

	private ArrayList<Text> listSource = new ArrayList<Text>();
	private ArrayList<Text> listTarget = new ArrayList<Text>();
	

	@Override
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {

		// Clear our lists
		listSource.clear();
		listTarget.clear();
		// iterate through all our values, binning each record based on what
		// it was tagged with
		// make sure to remove the tag!
		for (Text t : values) 
		{
			if (t.charAt(0) == 't') 
			{
				Text target = new Text(t.toString().substring(1));
				listTarget.add(target);
				
			} else if (t.charAt(0) == 's') 
			{
				Text source = new Text(t.toString().substring(1));
				listSource.add(source);
				
			}
		}
		
		Text node = new Text();
		Text score = new Text();
		//node2 is the key itself
		// If both lists are not empty, join A with B
			if (!listTarget.isEmpty() && !listSource.isEmpty()) {
				
				for (Text A : listTarget) {
					String first[] = A.toString().split("_");
					node.set(first[0]);
					for (Text B : listSource) {
						String second[] = B.toString().split("_");
						//score is appended with node2,node3,score1,score2
						score.set(key.toString()+","+second[0]+","+first[1]+","+second[1]);
						context.write(node,score);
					}
				}
			}
	}
}

public static class ReducerSecond extends Reducer<Text, Text, Text, Text> 
{

	private ArrayList<Text> listSource = new ArrayList<Text>();
	private ArrayList<Text> listTarget = new ArrayList<Text>();
	

	@Override
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {

		// Clear our lists
		listSource.clear();
		listTarget.clear();
		// iterate through all our values, binning each record based on what
		// it was tagged with
		// make sure to remove the tag!
		for (Text t : values) 
		{
			if (t.charAt(0) == 't') 
			{
				Text target = new Text(t.toString().substring(1));
				listTarget.add(target);
				//node4_score3
			} else if (t.charAt(0) == 's') 
			{
				Text source = new Text(t.toString().substring(1));
				listSource.add(source);
				//node1_node2_score1_score2
			}
		}
		
		Text k = new Text();
		Text v = new Text();
		//node3 is the key itself
		// If both lists are not empty, join A with B
			if (!listTarget.isEmpty() && !listSource.isEmpty()) {
				
				for (Text A : listSource) {
					String first[] = A.toString().split("_");
					k.set(first[0]);
					for (Text B : listTarget) {
						String second[] = B.toString().split("_");
						//score is appended with node2,node3,score1,score2
						v.set(first[1]+","+key.toString()+","+second[0]+","+first[2]+","+first[3]+","+second[1]);
						context.write(k,v);
					}
				}
			}
	}
}


	@Override
	public int run(final String[] args) throws Exception {
		final Configuration conf = getConf();
		final Job job1 = Job.getInstance(conf, "Reducer Side Join");
		job1.setJarByClass(MainClass.class);
		final Configuration jobConf = job1.getConfiguration();
		jobConf.set("mapreduce.output.textoutputformat.separator", ",");
		job1.setOutputKeyClass(Text.class);
		job1.setOutputValueClass(Text.class);
		MultipleInputs.addInputPath(job1, new Path(args[0]),TextInputFormat.class, MapperFirst.class);
		job1.setReducerClass(ReducerFirst.class);
		FileOutputFormat.setOutputPath(job1, new Path(args[1]+"/step1"));
		
		job1.waitForCompletion(true);
		
		final Job job2 = Job.getInstance(conf, "Second join");
		job2.setJarByClass(MainClass.class);
		final Configuration jobConf2 = job2.getConfiguration();
		jobConf2.set("mapreduce.output.textoutputformat.separator", ",");
		MultipleInputs.addInputPath(job2, new Path(args[1]+"/step1"),TextInputFormat.class, MapperSecond.class);
		MultipleInputs.addInputPath(job2, new Path(args[0]),TextInputFormat.class, MapperThird.class); 
		job2.setReducerClass(ReducerSecond.class);
		job2.setNumReduceTasks(1);
		job2.setOutputKeyClass(Text.class);
		job2.setOutputValueClass(Text.class);
		// delete file, true for recursive
		FileOutputFormat.setOutputPath(job2, new Path(args[1]+"/step2"));
		if(job2.waitForCompletion(true))
			{
				return 0;
			}else
			{
				return 1;
			}
	}

	public static void main(final String[] args) {
		if (args.length != 2) {
			throw new Error("Two arguments required:\n<input-dir> <output-dir> ");
		}

		try {
			ToolRunner.run((Tool)new MainClass(), args);
		} catch (final Exception e) {
		logger.error("", e);
		}
	}

}
